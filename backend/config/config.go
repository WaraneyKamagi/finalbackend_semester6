// config/config.go
// Konfigurasi aplikasi: memuat variabel environment dan menyediakan struct Config global.
// Mendukung koneksi ke Supabase menggunakan URL dan API Key.
// File .env di direktori backend/ akan otomatis dibaca saat startup.

package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config menyimpan seluruh konfigurasi aplikasi
type Config struct {
	ServerPort     string
	SupabaseURL    string
	SupabaseKey    string
	FrontendOrigin string
	JWTSecret      string
}

// AppConfig adalah instance global dari Config
var AppConfig *Config

// LoadConfig membaca konfigurasi dari file .env (jika ada), lalu dari environment variables.
// File .env diutamakan hanya jika environment variable belum di-set sebelumnya.
func LoadConfig() {
	// Coba muat file .env — tidak error jika file tidak ada (misal di production/CI)
	if err := godotenv.Load(); err != nil {
		log.Println("ℹ️  File .env tidak ditemukan, membaca dari environment variables sistem")
	} else {
		log.Println("✅ File .env berhasil dimuat")
	}

	AppConfig = &Config{
		ServerPort:     getEnv("SERVER_PORT", "8080"),
		SupabaseURL:    getEnv("SUPABASE_URL", ""),
		SupabaseKey:    getEnv("SUPABASE_KEY", ""),
		FrontendOrigin: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
		JWTSecret:      getEnv("JWT_SECRET", "default-secret-ganti-di-production"),
	}

	// Validasi konfigurasi wajib
	missing := false
	if AppConfig.SupabaseURL == "" {
		log.Println("⚠️  SUPABASE_URL belum diatur. Isi di file .env atau set environment variable")
		missing = true
	}
	if AppConfig.SupabaseKey == "" {
		log.Println("⚠️  SUPABASE_KEY belum diatur. Isi di file .env atau set environment variable")
		missing = true
	}
	if missing {
		log.Println("⚠️  Beberapa konfigurasi Supabase belum diisi — aplikasi berjalan tanpa koneksi database")
	}

	log.Printf("✅ Konfigurasi dimuat — Port: %s | Frontend: %s | Supabase: %s",
		AppConfig.ServerPort,
		AppConfig.FrontendOrigin,
		maskURL(AppConfig.SupabaseURL),
	)
}

// getEnv mengambil environment variable atau mengembalikan nilai default
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

// maskURL menyembunyikan sebagian URL untuk keamanan di log
func maskURL(u string) string {
	if u == "" {
		return "(belum diatur)"
	}
	if len(u) > 30 {
		return u[:20] + "****" + u[len(u)-6:]
	}
	return u
}
