// main.go
// Entry point aplikasi backend.
// Memuat konfigurasi, menginisialisasi dependency (repository → service → handler),
// menyiapkan router, dan menjalankan server HTTP pada port yang dikonfigurasi.

package main

import (
	"log"

	"github.com/finalbackend/backend/config"
	"github.com/finalbackend/backend/handler"
	"github.com/finalbackend/backend/repository"
	"github.com/finalbackend/backend/router"
	"github.com/finalbackend/backend/service"
)

func main() {
	// 1. Muat konfigurasi dari environment variables
	config.LoadConfig()

	// 2. Inisialisasi Repository (layer database)
	// Mode In-Memory: data disimpan di RAM, cocok untuk testing Postman
	// Ganti ke NewUserRepository(), NewServiceRepository(), NewOrderRepository()
	// jika ingin menggunakan Supabase
	userRepo := repository.NewMemoryUserRepository()
	serviceRepo := repository.NewMemoryServiceRepository()
	orderRepo := repository.NewMemoryOrderRepository()

	log.Println("📦 Mode: In-Memory Storage (data akan hilang saat server restart)")

	// 3. Inisialisasi Service (layer business logic)
	userService := service.NewUserService(userRepo)
	serviceService := service.NewServiceService(serviceRepo)
	orderService := service.NewOrderService(orderRepo)

	// 4. Inisialisasi Handler (layer HTTP)
	h := handler.NewHandler(userService, serviceService, orderService)

	// 5. Setup Router dengan semua route
	r := router.SetupRouter(h)

	// 6. Jalankan server
	port := ":" + config.AppConfig.ServerPort
	log.Printf("🚀 Server berjalan di http://localhost%s", port)
	log.Printf("📋 Health check: http://localhost%s/health", port)
	log.Printf("📡 API base URL: http://localhost%s/api", port)

	if err := r.Run(port); err != nil {
		log.Fatalf("❌ Gagal menjalankan server: %v", err)
	}
}
