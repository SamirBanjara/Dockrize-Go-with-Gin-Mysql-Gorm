package routes

import (
	controllers "task/controllers"

	"github.com/gin-gonic/gin"
)

func SetUp(app *gin.Engine) {
	app.GET("api/user/", controllers.FindUser)
	app.GET("/api/users", controllers.FindUsers)
	app.POST("/api/user/:id", controllers.UpdateUser)
	app.GET("/api/user/:id", controllers.FindUser)
	app.DELETE("/api/user/:id", controllers.UserDelete)
}
