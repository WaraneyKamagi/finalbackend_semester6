// service/order_service.go
// Service Order: berisi business logic untuk fitur order/pesanan.
// Mengelola pembuatan order, update status, pembayaran, dan penghapusan.

package service

import (
	"fmt"
	"time"

	"github.com/finalbackend/backend/model"
	"github.com/finalbackend/backend/repository"
)

// OrderService interface mendefinisikan kontrak business logic untuk Order
type OrderService interface {
	GetAllOrders() ([]model.Order, error)
	GetOrderByID(id string) (*model.Order, error)
	GetOrdersByUserID(userID string) ([]model.Order, error)
	CreateOrder(req model.CreateOrderRequest) (*model.Order, error)
	UpdateOrder(id string, req model.UpdateOrderRequest) (*model.Order, error)
	DeleteOrder(id string) error
}

// orderService adalah implementasi OrderService
type orderService struct {
	repo repository.OrderRepository
}

// NewOrderService membuat instance baru OrderService dengan dependency injection
func NewOrderService(repo repository.OrderRepository) OrderService {
	return &orderService{repo: repo}
}

// GetAllOrders mengambil semua order
func (s *orderService) GetAllOrders() ([]model.Order, error) {
	orders, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil data order: %w", err)
	}
	return orders, nil
}

// GetOrderByID mengambil order berdasarkan ID
func (s *orderService) GetOrderByID(id string) (*model.Order, error) {
	order, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return order, nil
}

// GetOrdersByUserID mengambil semua order milik user tertentu
func (s *orderService) GetOrdersByUserID(userID string) ([]model.Order, error) {
	orders, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil data order user: %w", err)
	}
	return orders, nil
}

// CreateOrder membuat order baru dengan status awal "Menunggu Pembayaran"
func (s *orderService) CreateOrder(req model.CreateOrderRequest) (*model.Order, error) {
	now := time.Now()

	// ID tidak dikirim, dibuat otomatis oleh Supabase (gen_random_uuid)
	newOrder := &model.Order{
		UserID:      req.UserID,
		ServiceID:   req.ServiceID,
		ServiceName: req.ServiceName,
		GameAccount: req.GameAccount,
		Target:      req.Target,
		Tier:        req.Tier,
		TotalPrice:  req.TotalPrice,
		Notes:       req.Notes,
		Status:      "Menunggu Pembayaran",
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	created, err := s.repo.Create(newOrder)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat order: %w", err)
	}

	return created, nil
}

// UpdateOrder mengupdate status atau informasi pembayaran order
func (s *orderService) UpdateOrder(id string, req model.UpdateOrderRequest) (*model.Order, error) {
	// Siapkan data update — repository akan return error jika ID tidak ditemukan
	updates := map[string]interface{}{
		"updatedAt": time.Now().Format(time.RFC3339),
	}

	if req.Status != "" {
		updates["status"] = req.Status
	}
	if req.PaymentMethod != "" {
		updates["paymentMethod"] = req.PaymentMethod
	}
	if req.PaymentReference != "" {
		updates["paymentReference"] = req.PaymentReference
	}

	updated, err := s.repo.Update(id, updates)
	if err != nil {
		return nil, err
	}

	return updated, nil
}

// DeleteOrder menghapus order berdasarkan ID
func (s *orderService) DeleteOrder(id string) error {
	// Repository akan return error jika ID tidak ditemukan
	if err := s.repo.Delete(id); err != nil {
		return err
	}

	return nil
}
