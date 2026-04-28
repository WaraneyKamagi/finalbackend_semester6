// model/user.go
// Model User: mendefinisikan struktur data user untuk database dan request/response.
// Digunakan oleh repository, service, dan handler.

package model

import "time"

// User merepresentasikan entitas user di database
type User struct {
	ID        string    `json:"id,omitempty"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"` // omitempty agar tidak dikirim ke response
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

// UserResponse adalah response user tanpa password
type UserResponse struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

// LoginRequest adalah payload untuk login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// RegisterRequest adalah payload untuk registrasi
type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// ToResponse mengonversi User ke UserResponse (menghapus password)
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:    u.ID,
		Name:  u.Name,
		Email: u.Email,
		Role:  u.Role,
	}
}
