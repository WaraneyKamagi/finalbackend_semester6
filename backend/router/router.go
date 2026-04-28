// router/router.go
// Router: mendaftarkan semua route API, dikelompokkan berdasarkan fitur.
// Semua endpoint didaftarkan di satu file ini agar mudah dibaca dan dikelola.

package router

import (
	"github.com/finalbackend/backend/handler"
	"github.com/finalbackend/backend/middleware"
	"github.com/gin-gonic/gin"
)

// SetupRouter mengkonfigurasi semua route dan middleware, mengembalikan Gin engine
func SetupRouter(h *handler.Handler) *gin.Engine {
	r := gin.Default()

	// ==================== Middleware Global ====================
	r.Use(middleware.CORSMiddleware())

	// ==================== API Routes ====================
	api := r.Group("/api")
	{
		// ---------- Auth Routes ----------
		// POST /api/auth/login    → Login user
		// POST /api/auth/register → Register user baru
		auth := api.Group("/auth")
		{
			auth.POST("/login", h.Login)
			auth.POST("/register", h.Register)
		}

		// ---------- Service Routes ----------
		// GET    /api/services     → Ambil semua layanan
		// GET    /api/services/:id → Ambil layanan by ID
		// POST   /api/services     → Buat layanan baru (admin)
		// PUT    /api/services/:id → Update layanan (admin)
		// DELETE /api/services/:id → Hapus layanan (admin)
		services := api.Group("/services")
		{
			services.GET("", h.GetAllServices)
			services.GET("/:id", h.GetServiceByID)
			services.POST("", h.CreateService)
			services.PUT("/:id", h.UpdateService)
			services.DELETE("/:id", h.DeleteService)
		}

		// ---------- Order Routes ----------
		// GET    /api/orders               → Ambil semua order (admin)
		// GET    /api/orders/user/:userId  → Ambil order by user ID
		// GET    /api/orders/:id           → Ambil order by ID
		// POST   /api/orders               → Buat order baru
		// PUT    /api/orders/:id           → Update order (status/payment)
		// DELETE /api/orders/:id           → Hapus order
		//
		// PENTING: /user/:userId HARUS didaftarkan sebelum /:id
		// Jika /:id duluan, Gin akan menangkap "user" sebagai nilai :id
		// sehingga GetOrdersByUserID tidak pernah bisa dicapai.
		orders := api.Group("/orders")
		{
			orders.GET("", h.GetAllOrders)
			orders.GET("/user/:userId", h.GetOrdersByUserID)
			orders.GET("/:id", h.GetOrderByID)
			orders.POST("", h.CreateOrder)
			orders.PUT("/:id", h.UpdateOrder)
			orders.DELETE("/:id", h.DeleteOrder)
		}

		// ---------- User Routes ----------
		// GET /api/users      → Ambil semua user (admin, tanpa password)
		// GET /api/users/:id  → Ambil user by ID (tanpa password)
		users := api.Group("/users")
		{
			users.GET("", h.GetAllUsers)
			users.GET("/:id", h.GetUserByID)
		}

		// ---------- Chat Routes ----------
		// POST /api/chat → Chatbot konsultasi gratis (rule-based AI)
		api.POST("/chat", h.Chat)

		// ---------- Payment Routes ----------
		// POST /api/payment/qr             → Generate token QR untuk pembayaran
		// GET  /api/payment/verify/:token  → Verifikasi QR setelah di-scan (membuka browser)
		// GET  /api/payment/status/:token  → Polling status apakah QR sudah di-scan
		payment := api.Group("/payment")
		{
			payment.POST("/qr", h.GenerateQRToken)
			payment.GET("/verify/:token", h.VerifyQRPayment)
			payment.GET("/status/:token", h.CheckQRStatus)
		}
	}

	// ==================== Health Check ====================
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Backend berjalan dengan baik 🚀",
		})
	})

	return r
}
