// middleware/middleware.go
// Middleware: berisi middleware untuk Gin framework.
// Saat ini menyediakan CORS middleware agar frontend (React/Vite) bisa mengakses backend.
// Bisa ditambahkan middleware lain seperti auth, logging, rate limiting, dll.

package middleware

import (
	"strings"
	"time"

	"github.com/finalbackend/backend/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware mengatur Cross-Origin Resource Sharing (CORS)
// agar frontend di origin berbeda bisa mengakses backend API.
// Mendukung multiple origins yang dipisahkan koma di FRONTEND_ORIGIN env var.
// Contoh: FRONTEND_ORIGIN=http://localhost:5173,http://localhost:3000
func CORSMiddleware() gin.HandlerFunc {
	// Parse origins: bisa satu atau beberapa, dipisahkan koma
	rawOrigin := config.AppConfig.FrontendOrigin
	origins := []string{}
	for _, o := range strings.Split(rawOrigin, ",") {
		trimmed := strings.TrimSpace(o)
		if trimmed != "" {
			origins = append(origins, trimmed)
		}
	}

	// Fallback ke localhost:5173 jika kosong
	if len(origins) == 0 {
		origins = []string{"http://localhost:5173"}
	}

	return cors.New(cors.Config{
		AllowOrigins:     origins,
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
