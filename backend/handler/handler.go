// handler/handler.go
// Base Handler: menyediakan struct dasar dan dependency yang dibutuhkan oleh semua handler.
// Setiap handler fitur (auth, service, order) akan meng-embed struct ini.

package handler

import (
	"github.com/finalbackend/backend/service"
)

// Handler menyimpan semua service yang dibutuhkan oleh handler-handler
type Handler struct {
	UserService    service.UserService
	ServiceService service.ServiceService
	OrderService   service.OrderService
}

// NewHandler membuat instance Handler baru dengan semua dependency
func NewHandler(
	userService service.UserService,
	serviceService service.ServiceService,
	orderService service.OrderService,
) *Handler {
	return &Handler{
		UserService:    userService,
		ServiceService: serviceService,
		OrderService:   orderService,
	}
}
