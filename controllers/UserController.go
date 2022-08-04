package controllers

import (
	"net/http"
	"task/database"
	"task/models"

	"task/helpers"

	"github.com/gin-gonic/gin"
)

type CreateRegisterInput struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required"`
}
type UpdateUserInput struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required"`
}

func Register(c *gin.Context) {
	var input CreateRegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task := models.User{Name: input.Name, Email: input.Email}
	database.DB.Create(&task)

	c.JSON(http.StatusOK, gin.H{"data": task})
}

func GetNonce(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		panic(err)
	}
	if err := database.DB.Where("public_key = ?", user.PublicKey).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record no found!"})
		GetUserNonce(user.PublicKey)
		return
	} else {
		user.Nonce = helpers.GenerateRandomString(20)
		// err = CreateUser(user)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"data": "Public key already registered!"})
			return
		}

	}
	c.JSON(http.StatusOK, gin.H{"data": user.Nonce})
}

func CreateUser(models.User) {
	// please create new user
}

func SendSignature(c *gin.Context) {

}

func GetUserNonce(public_key string) {
	var user models.User
	result := database.DB.Select("nonce").Find(&user).Where("public_key =?", public_key)
	if result != nil {
		panic("err")
	}
}

func EmployeeList(c *gin.Context) {
	var users []models.User
	database.DB.Where("role =?", "employee")
	c.JSON(http.StatusOK, gin.H{"data": users})
}

func FindUsers(c *gin.Context) {
	var users []models.User
	database.DB.Find(&users)
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

func UpdateEmployee(c *gin.Context) {
	var user models.User
	id := c.Param("id")
	if err := database.DB.Where("id = ?", id).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	var input UpdateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Model(&user).Updates(input)

	c.JSON(http.StatusOK, gin.H{"data": user})
}

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
