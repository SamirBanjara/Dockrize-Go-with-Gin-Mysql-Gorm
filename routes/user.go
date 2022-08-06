package routes

import (
	controllers "task/controllers"

	"github.com/gin-gonic/gin"
)

func SetUp(app *gin.Engine) {

	app.POST("/api/auth/get-nonce", controllers.GetNonce)
	app.POST("/api/auth/login", controllers.SendSignature)
	app.GET("/api/auth/employee-list", controllers.EmployeeList)
	app.GET("/api/auth/employee/:id", controllers.EmployeeById)
	app.POST("/api/auth/employee-update", controllers.UpdateEmployee)
	app.DELETE("/api/auth/employee/:id", controllers.EmployeeDelete)
}
