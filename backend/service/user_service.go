// service/user_service.go
// Service User: berisi business logic untuk fitur autentikasi (login & register).
// Handler tidak boleh langsung mengakses database — harus melalui service ini.
// Service ini menggunakan UserRepository untuk operasi database.

package service

import (
	"fmt"

	"github.com/finalbackend/backend/model"
	"github.com/finalbackend/backend/repository"
)

// UserService interface mendefinisikan kontrak business logic untuk User
type UserService interface {
	Login(req model.LoginRequest) (*model.UserResponse, error)
	Register(req model.RegisterRequest) (*model.UserResponse, error)
	GetAllUsers() ([]model.UserResponse, error)
	GetUserByID(id string) (*model.UserResponse, error)
}

// userService adalah implementasi UserService
type userService struct {
	repo repository.UserRepository
}

// NewUserService membuat instance baru UserService dengan dependency injection
func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

// Login memverifikasi kredensial user dan mengembalikan data user jika valid
func (s *userService) Login(req model.LoginRequest) (*model.UserResponse, error) {
	// Cari user berdasarkan email
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("gagal mencari user: %w", err)
	}

	if user == nil {
		return nil, fmt.Errorf("email belum terdaftar")
	}

	// Verifikasi password (plaintext comparison sesuai frontend existing)
	// TODO: Gunakan bcrypt untuk hashing password di production
	if user.Password != req.Password {
		return nil, fmt.Errorf("password tidak sesuai")
	}

	response := user.ToResponse()
	return &response, nil
}

// Register membuat user baru setelah validasi email unik
func (s *userService) Register(req model.RegisterRequest) (*model.UserResponse, error) {
	// Cek apakah email sudah digunakan
	existingUser, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("gagal memeriksa email: %w", err)
	}

	if existingUser != nil {
		return nil, fmt.Errorf("email sudah digunakan")
	}

	// Buat user baru — ID tidak dikirim, dibuat otomatis oleh Supabase (gen_random_uuid)
	newUser := &model.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password, // TODO: Hash password di production
		Role:     "user",
	}

	createdUser, err := s.repo.Create(newUser)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat user: %w", err)
	}

	response := createdUser.ToResponse()
	return &response, nil
}

// GetAllUsers mengambil semua user (tanpa password)
func (s *userService) GetAllUsers() ([]model.UserResponse, error) {
	users, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil data users: %w", err)
	}

	var responses []model.UserResponse
	for _, user := range users {
		responses = append(responses, user.ToResponse())
	}

	return responses, nil
}

// GetUserByID mengambil user berdasarkan ID (tanpa password)
func (s *userService) GetUserByID(id string) (*model.UserResponse, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	response := user.ToResponse()
	return &response, nil
}
