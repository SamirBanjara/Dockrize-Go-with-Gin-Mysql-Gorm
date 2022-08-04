package main

import (
	"task/database"

	"task/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	database.Connect()
	app := gin.Default()
	routes.SetUp(app)
	app.Run()

}
