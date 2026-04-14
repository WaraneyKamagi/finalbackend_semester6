// repository/service_repository.go
// Repository Service: menangani semua operasi database untuk entitas Service.
// Mendukung operasi CRUD lengkap menggunakan Supabase REST API.

package repository

import (
	"encoding/json"
	"fmt"
	"net/url"

	"github.com/finalbackend/backend/model"
)

// ServiceRepository interface mendefinisikan kontrak operasi database untuk Service
type ServiceRepository interface {
	FindAll() ([]model.Service, error)
	FindByID(id string) (*model.Service, error)
	Create(service *model.Service) (*model.Service, error)
	Update(id string, service *model.Service) (*model.Service, error)
	Delete(id string) error
}

// serviceRepository adalah implementasi ServiceRepository menggunakan Supabase
type serviceRepository struct{}

// NewServiceRepository membuat instance baru ServiceRepository
func NewServiceRepository() ServiceRepository {
	return &serviceRepository{}
}

// FindAll mengambil semua service dari database
func (r *serviceRepository) FindAll() ([]model.Service, error) {
	data, err := supabaseRequest("GET", "services?select=*", nil)
	if err != nil {
		return nil, err
	}

	var services []model.Service
	if err := json.Unmarshal(data, &services); err != nil {
		return nil, fmt.Errorf("gagal unmarshal services: %w", err)
	}

	return services, nil
}

// FindByID mengambil service berdasarkan ID
func (r *serviceRepository) FindByID(id string) (*model.Service, error) {
	endpoint := fmt.Sprintf("services?id=eq.%s&select=*", url.QueryEscape(id))
	data, err := supabaseRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var services []model.Service
	if err := json.Unmarshal(data, &services); err != nil {
		return nil, fmt.Errorf("gagal unmarshal service: %w", err)
	}

	if len(services) == 0 {
		return nil, fmt.Errorf("service dengan ID %s tidak ditemukan", id)
	}

	return &services[0], nil
}

// Create menyimpan service baru ke database
func (r *serviceRepository) Create(service *model.Service) (*model.Service, error) {
	data, err := supabaseRequest("POST", "services", service)
	if err != nil {
		return nil, err
	}

	var created []model.Service
	if err := json.Unmarshal(data, &created); err != nil {
		return nil, fmt.Errorf("gagal unmarshal created service: %w", err)
	}

	if len(created) == 0 {
		return nil, fmt.Errorf("gagal membuat service")
	}

	return &created[0], nil
}

// Update mengupdate service berdasarkan ID
func (r *serviceRepository) Update(id string, service *model.Service) (*model.Service, error) {
	endpoint := fmt.Sprintf("services?id=eq.%s", url.QueryEscape(id))
	data, err := supabaseRequest("PATCH", endpoint, service)
	if err != nil {
		return nil, err
	}

	var updated []model.Service
	if err := json.Unmarshal(data, &updated); err != nil {
		return nil, fmt.Errorf("gagal unmarshal updated service: %w", err)
	}

	if len(updated) == 0 {
		return nil, fmt.Errorf("service dengan ID %s tidak ditemukan", id)
	}

	return &updated[0], nil
}

// Delete menghapus service berdasarkan ID
func (r *serviceRepository) Delete(id string) error {
	endpoint := fmt.Sprintf("services?id=eq.%s", url.QueryEscape(id))
	_, err := supabaseRequest("DELETE", endpoint, nil)
	return err
}
