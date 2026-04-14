// middleware/middleware.go
// Middleware: berisi middleware untuk Gin framework.
// Saat ini menyediakan CORS middleware agar frontend (React/Vite) bisa mengakses backend.
// Bisa ditambahkan middleware lain seperti auth, logging, rate limiting, dll.

package middleware

import (
	"time"

	"github.com/finalbackend/backend/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware mengatur Cross-Origin Resource Sharing (CORS)
// agar frontend di origin berbeda bisa mengakses backend API
func CORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{config.AppConfig.FrontendOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

// LoggerMiddleware adalah middleware untuk logging request (opsional tambahan)
func LoggerMiddleware() gin.HandlerFunc {
	return gin.Logger()
}

// RecoveryMiddleware adalah middleware untuk recovery dari panic (opsional tambahan)
func RecoveryMiddleware() gin.HandlerFunc {
	return gin.Recovery()
}
