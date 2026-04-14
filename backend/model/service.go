// model/service.go
// Model Service: mendefinisikan struktur data layanan joki gaming.
// Berisi informasi nama, deskripsi, harga dasar, dan estimasi waktu.

package model

// Service merepresentasikan entitas layanan di database
type Service struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	BasePrice   int    `json:"basePrice"`
	ETA         string `json:"eta"`
}

// CreateServiceRequest adalah payload untuk membuat service baru
type CreateServiceRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
	BasePrice   int    `json:"basePrice" binding:"required"`
	ETA         string `json:"eta" binding:"required"`
}

// UpdateServiceRequest adalah payload untuk update service
type UpdateServiceRequest struct {
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	BasePrice   int    `json:"basePrice,omitempty"`
	ETA         string `json:"eta,omitempty"`
}
