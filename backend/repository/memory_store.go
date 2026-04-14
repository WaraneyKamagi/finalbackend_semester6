// repository/memory_store.go
// In-Memory Repository: implementasi repository menggunakan penyimpanan di RAM.
// Digunakan untuk testing dan development tanpa perlu koneksi ke Supabase.
// Data di-seed otomatis dengan data awal saat inisialisasi.
// CATATAN: Data akan hilang saat server di-restart.

package repository

import (
	"fmt"
	"sync"
	"time"

	"github.com/finalbackend/backend/model"
)

// ==================== User Memory Repository ====================

type memoryUserRepository struct {
	mu    sync.RWMutex
	users []model.User
}

// NewMemoryUserRepository membuat UserRepository in-memory dengan seed data
func NewMemoryUserRepository() UserRepository {
	return &memoryUserRepository{
		users: []model.User{
			{ID: "1", Name: "Demo Player", Email: "demo@jokigaming.com", Password: "password123", Role: "user"},
			{ID: "admin-1", Name: "Admin Joki", Email: "admin@joki.com", Password: "admin123", Role: "admin"},
			{ID: "c4e5", Name: "marcel", Email: "marcel@joki.com", Password: "marcel123", Role: "user"},
			{ID: "b1be", Name: "metuvenom", Email: "mv@gmail.com", Password: "123456", Role: "user"},
		},
	}
}

func (r *memoryUserRepository) FindAll() ([]model.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]model.User, len(r.users))
	copy(result, r.users)
	return result, nil
}

func (r *memoryUserRepository) FindByID(id string) (*model.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, u := range r.users {
		if u.ID == id {
			user := u
			return &user, nil
		}
	}
	return nil, fmt.Errorf("user dengan ID %s tidak ditemukan", id)
}

func (r *memoryUserRepository) FindByEmail(email string) (*model.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, u := range r.users {
		if u.Email == email {
			user := u
			return &user, nil
		}
	}
	return nil, nil // tidak ditemukan bukan error
}

func (r *memoryUserRepository) Create(user *model.User) (*model.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Cek email duplikat
	for _, u := range r.users {
		if u.Email == user.Email {
			return nil, fmt.Errorf("email %s sudah digunakan", user.Email)
		}
	}

	r.users = append(r.users, *user)
	created := *user
	return &created, nil
}

// ==================== Service Memory Repository ====================

type memoryServiceRepository struct {
	mu       sync.RWMutex
	services []model.Service
}

// NewMemoryServiceRepository membuat ServiceRepository in-memory dengan seed data
func NewMemoryServiceRepository() ServiceRepository {
	return &memoryServiceRepository{
		services: []model.Service{
			{ID: "1", Name: "Push Rank", Description: "Bantu capai rank Mythic dengan pilot pro dan jadwal fleksibel.", BasePrice: 275000, ETA: "3-5 hari"},
			{ID: "2", Name: "Push MMR Hero", Description: "Fokus satu hero untuk naikkan MMR hero favoritmu secara konsisten.", BasePrice: 200000, ETA: "2-4 hari"},
			{ID: "3", Name: "Push Peak Point", Description: "Optimalkan peak point season ini dengan pilot spesialis turnamen.", BasePrice: 250000, ETA: "4-6 hari"},
		},
	}
}

func (r *memoryServiceRepository) FindAll() ([]model.Service, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]model.Service, len(r.services))
	copy(result, r.services)
	return result, nil
}

func (r *memoryServiceRepository) FindByID(id string) (*model.Service, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, s := range r.services {
		if s.ID == id {
			svc := s
			return &svc, nil
		}
	}
	return nil, fmt.Errorf("service dengan ID %s tidak ditemukan", id)
}

func (r *memoryServiceRepository) Create(service *model.Service) (*model.Service, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.services = append(r.services, *service)
	created := *service
	return &created, nil
}

func (r *memoryServiceRepository) Update(id string, service *model.Service) (*model.Service, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, s := range r.services {
		if s.ID == id {
			service.ID = id
			r.services[i] = *service
			updated := *service
			return &updated, nil
		}
	}
	return nil, fmt.Errorf("service dengan ID %s tidak ditemukan", id)
}

func (r *memoryServiceRepository) Delete(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, s := range r.services {
		if s.ID == id {
			r.services = append(r.services[:i], r.services[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("service dengan ID %s tidak ditemukan", id)
}

// ==================== Order Memory Repository ====================

type memoryOrderRepository struct {
	mu     sync.RWMutex
	orders []model.Order
}

// NewMemoryOrderRepository membuat OrderRepository in-memory dengan seed data
func NewMemoryOrderRepository() OrderRepository {
	now := time.Now()
	return &memoryOrderRepository{
		orders: []model.Order{
			{
				ID: "1", UserID: "1", ServiceID: "1", ServiceName: "Push Rank",
				GameAccount: model.GameAccount{Username: "DemoPlayer01", Server: "Asia", CurrentRank: "Legend V"},
				Target: "Mythic", Tier: "priority", TotalPrice: 210000,
				Notes: "Prioritaskan hero assassin", Status: "Diproses",
				PaymentMethod: "Transfer Bank",
				CreatedAt: now.Add(-72 * time.Hour), UpdatedAt: now.Add(-48 * time.Hour),
			},
			{
				ID: "7ded", UserID: "1", ServiceID: "1", ServiceName: "Push Rank",
				GameAccount: model.GameAccount{Username: "xenonnnn", Server: "indonesia", CurrentRank: "master v"},
				Target: "epic 55", Tier: "express", TotalPrice: 225000,
				Notes: "spam mayene bang", Status: "Selesai",
				PaymentMethod: "Transfer Bank", PaymentReference: "done",
				CreatedAt: now.Add(-24 * time.Hour), UpdatedAt: now.Add(-20 * time.Hour),
			},
			{
				ID: "10f3", UserID: "c4e5", ServiceID: "3", ServiceName: "Push Peak Point",
				GameAccount: model.GameAccount{Username: "shadow", Server: "asia", CurrentRank: "1300"},
				Target: "1900", Tier: "express", TotalPrice: 375000,
				Notes: "push mayene bang", Status: "Menunggu Konfirmasi",
				PaymentMethod: "QRIS",
				CreatedAt: now.Add(-12 * time.Hour), UpdatedAt: now.Add(-11 * time.Hour),
			},
		},
	}
}

func (r *memoryOrderRepository) FindAll() ([]model.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]model.Order, len(r.orders))
	copy(result, r.orders)
	return result, nil
}

func (r *memoryOrderRepository) FindByID(id string) (*model.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, o := range r.orders {
		if o.ID == id {
			order := o
			return &order, nil
		}
	}
	return nil, fmt.Errorf("order dengan ID %s tidak ditemukan", id)
}

func (r *memoryOrderRepository) FindByUserID(userID string) ([]model.Order, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []model.Order
	for _, o := range r.orders {
		if o.UserID == userID {
			result = append(result, o)
		}
	}
	return result, nil
}

func (r *memoryOrderRepository) Create(order *model.Order) (*model.Order, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.orders = append(r.orders, *order)
	created := *order
	return &created, nil
}

func (r *memoryOrderRepository) Update(id string, updates map[string]interface{}) (*model.Order, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, o := range r.orders {
		if o.ID == id {
			if v, ok := updates["status"]; ok {
				r.orders[i].Status = v.(string)
			}
			if v, ok := updates["paymentMethod"]; ok {
				r.orders[i].PaymentMethod = v.(string)
			}
			if v, ok := updates["paymentReference"]; ok {
				r.orders[i].PaymentReference = v.(string)
			}
			r.orders[i].UpdatedAt = time.Now()
			updated := r.orders[i]
			return &updated, nil
		}
	}
	return nil, fmt.Errorf("order dengan ID %s tidak ditemukan", id)
}

func (r *memoryOrderRepository) Delete(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, o := range r.orders {
		if o.ID == id {
			r.orders = append(r.orders[:i], r.orders[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("order dengan ID %s tidak ditemukan", id)
}
