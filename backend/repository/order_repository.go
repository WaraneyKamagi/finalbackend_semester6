// repository/order_repository.go
// Repository Order: menangani semua operasi database untuk entitas Order.
// Mendukung operasi CRUD, filter berdasarkan userId, dan pengurutan.

package repository

import (
	"encoding/json"
	"fmt"
	"net/url"

	"github.com/finalbackend/backend/model"
)

// OrderRepository interface mendefinisikan kontrak operasi database untuk Order
type OrderRepository interface {
	FindAll() ([]model.Order, error)
	FindByID(id string) (*model.Order, error)
	FindByUserID(userID string) ([]model.Order, error)
	Create(order *model.Order) (*model.Order, error)
	Update(id string, updates map[string]interface{}) (*model.Order, error)
	Delete(id string) error
}

// orderRepository adalah implementasi OrderRepository menggunakan Supabase
type orderRepository struct{}

// NewOrderRepository membuat instance baru OrderRepository
func NewOrderRepository() OrderRepository {
	return &orderRepository{}
}

// FindAll mengambil semua order dari database, diurutkan berdasarkan createdAt descending
func (r *orderRepository) FindAll() ([]model.Order, error) {
	data, err := supabaseRequest("GET", "orders?select=*&order=createdAt.desc", nil)
	if err != nil {
		return nil, err
	}

	var orders []model.Order
	if err := json.Unmarshal(data, &orders); err != nil {
		return nil, fmt.Errorf("gagal unmarshal orders: %w", err)
	}

	return orders, nil
}

// FindByID mengambil order berdasarkan ID
func (r *orderRepository) FindByID(id string) (*model.Order, error) {
	endpoint := fmt.Sprintf("orders?id=eq.%s&select=*", url.QueryEscape(id))
	data, err := supabaseRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var orders []model.Order
	if err := json.Unmarshal(data, &orders); err != nil {
		return nil, fmt.Errorf("gagal unmarshal order: %w", err)
	}

	if len(orders) == 0 {
		return nil, fmt.Errorf("order dengan ID %s tidak ditemukan", id)
	}

	return &orders[0], nil
}

// FindByUserID mengambil semua order milik user tertentu
func (r *orderRepository) FindByUserID(userID string) ([]model.Order, error) {
	endpoint := fmt.Sprintf("orders?userId=eq.%s&select=*&order=createdAt.desc", url.QueryEscape(userID))
	data, err := supabaseRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var orders []model.Order
	if err := json.Unmarshal(data, &orders); err != nil {
		return nil, fmt.Errorf("gagal unmarshal orders: %w", err)
	}

	return orders, nil
}

// Create menyimpan order baru ke database
func (r *orderRepository) Create(order *model.Order) (*model.Order, error) {
	data, err := supabaseRequest("POST", "orders", order)
	if err != nil {
		return nil, err
	}

	var created []model.Order
	if err := json.Unmarshal(data, &created); err != nil {
		return nil, fmt.Errorf("gagal unmarshal created order: %w", err)
	}

	if len(created) == 0 {
		return nil, fmt.Errorf("gagal membuat order")
	}

	return &created[0], nil
}

// Update mengupdate order berdasarkan ID menggunakan map untuk partial update
func (r *orderRepository) Update(id string, updates map[string]interface{}) (*model.Order, error) {
	endpoint := fmt.Sprintf("orders?id=eq.%s", url.QueryEscape(id))
	data, err := supabaseRequest("PATCH", endpoint, updates)
	if err != nil {
		return nil, err
	}

	var updated []model.Order
	if err := json.Unmarshal(data, &updated); err != nil {
		return nil, fmt.Errorf("gagal unmarshal updated order: %w", err)
	}

	if len(updated) == 0 {
		return nil, fmt.Errorf("order dengan ID %s tidak ditemukan", id)
	}

	return &updated[0], nil
}

// Delete menghapus order berdasarkan ID
func (r *orderRepository) Delete(id string) error {
	endpoint := fmt.Sprintf("orders?id=eq.%s", url.QueryEscape(id))
	_, err := supabaseRequest("DELETE", endpoint, nil)
	return err
}
