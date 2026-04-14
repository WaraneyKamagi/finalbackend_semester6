// model/order.go
// Model Order: mendefinisikan struktur data pesanan/order.
// Berisi informasi user, service, akun game, target, tier, harga, status, dan pembayaran.

package model

import "time"

// GameAccount menyimpan informasi akun game pelanggan
type GameAccount struct {
	Username       string `json:"username,omitempty"`
	Password       string `json:"password,omitempty"`
	Server         string `json:"server,omitempty"`
	CurrentRank    string `json:"currentRank,omitempty"`
	TargetRank     string `json:"targetRank,omitempty"`
	CurrentStar    int    `json:"currentStar,omitempty"`
	TargetStar     int    `json:"targetStar,omitempty"`
	HeroName       string `json:"heroName,omitempty"`
	MMRCurrent     int    `json:"mmrCurrent,omitempty"`
	MMRTarget      int    `json:"mmrTarget,omitempty"`
	PeakPoint      int    `json:"peakPoint,omitempty"`
	TargetPeakPoint int   `json:"targetPeakPoint,omitempty"`
}

// Order merepresentasikan entitas pesanan di database
type Order struct {
	ID               string      `json:"id"`
	UserID           string      `json:"userId"`
	ServiceID        string      `json:"serviceId"`
	ServiceName      string      `json:"serviceName"`
	GameAccount      GameAccount `json:"gameAccount"`
	Target           string      `json:"target"`
	Tier             string      `json:"tier"`
	TotalPrice       int         `json:"totalPrice"`
	Notes            string      `json:"notes"`
	Status           string      `json:"status"`
	PaymentMethod    string      `json:"paymentMethod"`
	PaymentReference string      `json:"paymentReference"`
	CreatedAt        time.Time   `json:"createdAt"`
	UpdatedAt        time.Time   `json:"updatedAt"`
}

// CreateOrderRequest adalah payload untuk membuat order baru
type CreateOrderRequest struct {
	UserID      string      `json:"userId" binding:"required"`
	ServiceID   string      `json:"serviceId" binding:"required"`
	ServiceName string      `json:"serviceName" binding:"required"`
	GameAccount GameAccount `json:"gameAccount" binding:"required"`
	Target      string      `json:"target" binding:"required"`
	Tier        string      `json:"tier" binding:"required"`
	TotalPrice  int         `json:"totalPrice" binding:"required"`
	Notes       string      `json:"notes"`
}

// UpdateOrderRequest adalah payload untuk update order (status, pembayaran, dll.)
type UpdateOrderRequest struct {
	Status           string `json:"status,omitempty"`
	PaymentMethod    string `json:"paymentMethod,omitempty"`
	PaymentReference string `json:"paymentReference,omitempty"`
}
