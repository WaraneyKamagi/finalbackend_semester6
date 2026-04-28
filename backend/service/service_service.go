// service/service_service.go
// Service Service: berisi business logic untuk fitur layanan (CRUD Service/Layanan).
// Mengelola operasi pada entitas Service melalui ServiceRepository.

package service

import (
	"fmt"

	"github.com/finalbackend/backend/model"
	"github.com/finalbackend/backend/repository"
)

// ServiceService interface mendefinisikan kontrak business logic untuk Service
type ServiceService interface {
	GetAllServices() ([]model.Service, error)
	GetServiceByID(id string) (*model.Service, error)
	CreateService(req model.CreateServiceRequest) (*model.Service, error)
	UpdateService(id string, req model.UpdateServiceRequest) (*model.Service, error)
	DeleteService(id string) error
}

// serviceService adalah implementasi ServiceService
type serviceService struct {
	repo repository.ServiceRepository
}

// NewServiceService membuat instance baru ServiceService dengan dependency injection
func NewServiceService(repo repository.ServiceRepository) ServiceService {
	return &serviceService{repo: repo}
}

// GetAllServices mengambil semua layanan
func (s *serviceService) GetAllServices() ([]model.Service, error) {
	services, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil data layanan: %w", err)
	}
	return services, nil
}

// GetServiceByID mengambil layanan berdasarkan ID
func (s *serviceService) GetServiceByID(id string) (*model.Service, error) {
	service, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return service, nil
}

// CreateService membuat layanan baru
func (s *serviceService) CreateService(req model.CreateServiceRequest) (*model.Service, error) {
	// ID tidak dikirim, dibuat otomatis oleh Supabase (gen_random_uuid)
	newService := &model.Service{
		Name:        req.Name,
		Description: req.Description,
		BasePrice:   req.BasePrice,
		ETA:         req.ETA,
	}

	created, err := s.repo.Create(newService)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat layanan: %w", err)
	}

	return created, nil
}

// UpdateService mengupdate layanan berdasarkan ID
func (s *serviceService) UpdateService(id string, req model.UpdateServiceRequest) (*model.Service, error) {
	// Cek apakah service ada
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Update hanya field yang diisi
	if req.Name != "" {
		existing.Name = req.Name
	}
	if req.Description != "" {
		existing.Description = req.Description
	}
	if req.BasePrice != 0 {
		existing.BasePrice = req.BasePrice
	}
	if req.ETA != "" {
		existing.ETA = req.ETA
	}

	updated, err := s.repo.Update(id, existing)
	if err != nil {
		return nil, fmt.Errorf("gagal mengupdate layanan: %w", err)
	}

	return updated, nil
}

// DeleteService menghapus layanan berdasarkan ID
func (s *serviceService) DeleteService(id string) error {
	// Repository akan return error jika ID tidak ditemukan
	if err := s.repo.Delete(id); err != nil {
		return err
	}

	return nil
}
