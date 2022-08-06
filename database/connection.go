package database

import (
	"task/models"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var DB *gorm.DB

func Connect() {
	connection, err := gorm.Open("mysql", "user:user@123@tcp(mysql:3306)/task_db")

	if err != nil {
		panic("Failed to connect to database!!!")
	}
	connection.AutoMigrate(&models.User{})
	DB = connection
}

func ConnectLocal() {
	connection, err := gorm.Open("mysql", "root:@tcp(localhost:3306)/task_db")

	if err != nil {
		panic("Failed to connect to database!!!")
	}
	connection.AutoMigrate(&models.User{})
	DB = connection
}
