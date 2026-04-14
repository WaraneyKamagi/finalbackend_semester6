// config/config.go
// Konfigurasi aplikasi: memuat variabel environment dan menyediakan struct Config global.
// Mendukung koneksi ke Supabase menggunakan URL dan API Key.

package config

import (
	"log"
	"os"
)

// Config menyimpan seluruh konfigurasi aplikasi
type Config struct {
	ServerPort     string
	SupabaseURL    string
	SupabaseKey    string
	FrontendOrigin string
}

// AppConfig adalah instance global dari Config
var AppConfig *Config

// LoadConfig membaca konfigurasi dari environment variables
// Jika tidak ditemukan, menggunakan nilai default
func LoadConfig() {
	AppConfig = &Config{
		ServerPort:     getEnv("SERVER_PORT", "8080"),
		SupabaseURL:    getEnv("SUPABASE_URL", ""),
		SupabaseKey:    getEnv("SUPABASE_KEY", ""),
		FrontendOrigin: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
	}

	// Validasi konfigurasi wajib
	if AppConfig.SupabaseURL == "" {
		log.Println("⚠️  SUPABASE_URL belum diatur. Set environment variable SUPABASE_URL")
	}
	if AppConfig.SupabaseKey == "" {
		log.Println("⚠️  SUPABASE_KEY belum diatur. Set environment variable SUPABASE_KEY")
	}

	log.Printf("✅ Konfigurasi dimuat - Port: %s, Frontend: %s", AppConfig.ServerPort, AppConfig.FrontendOrigin)
}

// getEnv mengambil environment variable atau mengembalikan nilai default
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
