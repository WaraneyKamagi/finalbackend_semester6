// repository/user_repository.go
// Repository User: menangani semua operasi database untuk entitas User.
// Menggunakan Supabase REST API sebagai database.
// Service layer tidak boleh langsung query ke database — harus melalui repository ini.

package repository

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/finalbackend/backend/config"
	"github.com/finalbackend/backend/model"
)

// UserRepository interface mendefinisikan kontrak operasi database untuk User
type UserRepository interface {
	FindAll() ([]model.User, error)
	FindByID(id string) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	Create(user *model.User) (*model.User, error)
}

// userRepository adalah implementasi UserRepository menggunakan Supabase
type userRepository struct{}

// NewUserRepository membuat instance baru UserRepository
func NewUserRepository() UserRepository {
	return &userRepository{}
}

// supabaseRequest adalah helper internal untuk melakukan request ke Supabase REST API
func supabaseRequest(method, endpoint string, body interface{}) ([]byte, error) {
	cfg := config.AppConfig

	var reqBody io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("gagal marshal body: %w", err)
		}
		reqBody = bytes.NewBuffer(jsonBody)
	}

	fullURL := fmt.Sprintf("%s/rest/v1/%s", cfg.SupabaseURL, endpoint)
	req, err := http.NewRequest(method, fullURL, reqBody)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat request: %w", err)
	}

	req.Header.Set("apikey", cfg.SupabaseKey)
	req.Header.Set("Authorization", "Bearer "+cfg.SupabaseKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("gagal mengirim request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("gagal membaca response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase error (%d): %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

// FindAll mengambil semua user dari database
func (r *userRepository) FindAll() ([]model.User, error) {
	data, err := supabaseRequest("GET", "users?select=*", nil)
	if err != nil {
		return nil, err
	}

	var users []model.User
	if err := json.Unmarshal(data, &users); err != nil {
		return nil, fmt.Errorf("gagal unmarshal users: %w", err)
	}

	return users, nil
}

// FindByID mengambil user berdasarkan ID
func (r *userRepository) FindByID(id string) (*model.User, error) {
	endpoint := fmt.Sprintf("users?id=eq.%s&select=*", url.QueryEscape(id))
	data, err := supabaseRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var users []model.User
	if err := json.Unmarshal(data, &users); err != nil {
		return nil, fmt.Errorf("gagal unmarshal user: %w", err)
	}

	if len(users) == 0 {
		return nil, fmt.Errorf("user dengan ID %s tidak ditemukan", id)
	}

	return &users[0], nil
}

// FindByEmail mengambil user berdasarkan email
func (r *userRepository) FindByEmail(email string) (*model.User, error) {
	endpoint := fmt.Sprintf("users?email=eq.%s&select=*", url.QueryEscape(email))
	data, err := supabaseRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var users []model.User
	if err := json.Unmarshal(data, &users); err != nil {
		return nil, fmt.Errorf("gagal unmarshal user: %w", err)
	}

	if len(users) == 0 {
		return nil, nil // User tidak ditemukan, bukan error
	}

	return &users[0], nil
}

// Create menyimpan user baru ke database
func (r *userRepository) Create(user *model.User) (*model.User, error) {
	data, err := supabaseRequest("POST", "users", user)
	if err != nil {
		return nil, err
	}

	var created []model.User
	if err := json.Unmarshal(data, &created); err != nil {
		return nil, fmt.Errorf("gagal unmarshal created user: %w", err)
	}

	if len(created) == 0 {
		return nil, fmt.Errorf("gagal membuat user")
	}

	return &created[0], nil
}
