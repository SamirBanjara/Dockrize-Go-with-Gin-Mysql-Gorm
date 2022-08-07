package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"task/database"
	"task/models"
	"time"

	"task/helpers"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

type UpdateUserInput struct {
	Name          string `json:"name"`
	Email         string `json:"email"`
	Address       string `json:"address"`
	PublicKey     string `json:"pb"`
	Post          string `json:"post"`
	Annual_Salary string `json:"annual_salary"`
}

const SecretKey = "secret"

// Paths Information

// Login godoc
// @Summary Provides a JSON Web Token
// @Description Authenticates a user and provides a JWT to Authorize API calls
// @ID Authentication
// @Tags         Login
// @Consume application/x-www-form-urlencoded
// @Produce json
// @Param public_key formData string true "PublicKey"
// @Router /get-nonce [post]
func GetNonce(c *gin.Context) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err})
	}
	if err := database.DB.Where("public_key = ?", user.PublicKey).First(&user).Error; err != nil {
		user.Nonce = helpers.GenerateRandomString(20)
		user = CreateUser(user)
		c.JSON(http.StatusOK, gin.H{"nonce": user.Nonce})
	} else {
		c.JSON(http.StatusOK, gin.H{"nonce": user.Nonce})
	}
}

func CreateUser(user models.User) models.User {
	db_user := models.User{PublicKey: user.PublicKey, Nonce: user.Nonce, Role: user.Role}
	database.DB.Create(&db_user)
	return db_user
}

func SendSignature(c *gin.Context) {
	user := models.User{}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err})
	}

	decodedSig, err := hexutil.Decode(user.Signature)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err})
	}
	if decodedSig[64] != 27 && decodedSig[64] != 28 {
		return
	}
	decodedSig[64] -= 27
	user_nonce := GetUserNonce(user.PublicKey)
	prefixedNonce := fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(user_nonce), user_nonce)
	hash := crypto.Keccak256Hash([]byte(prefixedNonce))
	recoveredPublicKey, err := crypto.Ecrecover(hash.Bytes(), decodedSig)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err})
	}
	secp256k1RecoveredPublicKey, err := crypto.UnmarshalPubkey(recoveredPublicKey)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err})
	}
	recoveredAddress := crypto.PubkeyToAddress(*secp256k1RecoveredPublicKey).Hex()
	isClientAddressEqualToRecoveredAddress := strings.ToLower(user.PublicKey) == strings.ToLower(recoveredAddress)
	if isClientAddressEqualToRecoveredAddress {
		user.Nonce = helpers.GenerateRandomString(20)
		UpdateNonce(user.PublicKey, user.Nonce)
	}
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, _ := claims.SignedString([]byte(SecretKey))

	resp := map[string]string{
		"authenticated": strconv.FormatBool(isClientAddressEqualToRecoveredAddress),
		"token":         token,
	}
	user = GetUserByPublicKey(user.PublicKey)
	data, _ := json.Marshal(user)
	resp["user"] = string(data)
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

func GetUserByPublicKey(public_key string) models.User {
	user := models.User{}
	if err := database.DB.Where("public_key = ?", public_key).First(&user).Error; err != nil {
		panic("Record not found!")
	}
	return user
}

func UpdateNonce(public_key string, nonce string) error {
	user := models.User{}
	if err := database.DB.Where("public_key = ?", public_key).First(&user).Error; err != nil {
		panic("Record not found!")
	}
	user.Nonce = nonce
	database.DB.Model(&user).Updates(user)
	return nil
}

func GetUserNonce(public_key string) string {
	var user models.User
	if err := database.DB.Where("public_key = ?", public_key).First(&user).Error; err != nil {
		return "data not found"
	}
	return user.Nonce
}

// Employee List godoc
// @Summary Provides a JSON Web Token
// @Description Get Employees List
// @Tags         Employee List
// @Security bearerAuth
// @Consume application/x-www-form-urlencoded
// @Produce json
// @Router /employee-list [get]
func EmployeeList(c *gin.Context) {
	var users []models.User
	if err := database.DB.Where("role = ?", "employee").Find(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record no found!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": users})
}

func EmployeeById(c *gin.Context) {
	var user models.User
	id := c.Param("id")
	if err := database.DB.Where("id = ?", id).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record no found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// Employee Update godoc
// @Summary Provides a JSON Web Token
// @Description Update Employee
// @Tags         Update Employee
// @Security bearerAuth
// @Param employee body models.User true "Update Employee"
// @Consume application/x-www-form-urlencoded
// @Produce json
// @Router /employee-update [post]
func UpdateEmployee(c *gin.Context) {
	var user models.User
	var input UpdateUserInput
	if err := c.BindJSON(&input); err != nil {
		panic(err)
	}
	if err := database.DB.Where("public_key = ?", input.PublicKey).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}
	database.DB.Model(&user).Updates(input)
	c.JSON(http.StatusOK, gin.H{"data": user})
}

// Employee Delete godoc
// @Summary Provides a JSON Web Token
// @Description Update Employee
// @Tags         Delete Employee
// @Security bearerAuth
// @Param  id path int true "Employee ID"
// @Consume application/x-www-form-urlencoded
// @Produce json
// @Router /employee/{id} [delete]
func EmployeeDelete(c *gin.Context) {
	var user models.User
	id := c.Param("id")
	if err := database.DB.Where("id = ?", id).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Usre Deleted Successfully"})
}
