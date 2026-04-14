// handler/order_handler.go
// Handler Order: menangani HTTP request untuk fitur CRUD order/pesanan.
// Hanya berisi logic HTTP: parsing request, memanggil service, mengirim response.

package handler

import (
	"github.com/finalbackend/backend/model"
	"github.com/finalbackend/backend/utils"
	"github.com/gin-gonic/gin"
)

// GetAllOrders menangani GET /api/orders
func (h *Handler) GetAllOrders(c *gin.Context) {
	orders, err := h.OrderService.GetAllOrders()
	if err != nil {
		utils.InternalError(c, "Gagal mengambil data order: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Berhasil mengambil data order", orders)
}

// GetOrderByID menangani GET /api/orders/:id
func (h *Handler) GetOrderByID(c *gin.Context) {
	id := c.Param("id")

	order, err := h.OrderService.GetOrderByID(id)
	if err != nil {
		utils.NotFound(c, "Order tidak ditemukan: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Berhasil mengambil data order", order)
}

// GetOrdersByUserID menangani GET /api/orders/user/:userId
func (h *Handler) GetOrdersByUserID(c *gin.Context) {
	userID := c.Param("userId")

	orders, err := h.OrderService.GetOrdersByUserID(userID)
	if err != nil {
		utils.InternalError(c, "Gagal mengambil data order: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Berhasil mengambil data order user", orders)
}

// CreateOrder menangani POST /api/orders
func (h *Handler) CreateOrder(c *gin.Context) {
	var req model.CreateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Data order tidak valid: "+err.Error())
		return
	}

	order, err := h.OrderService.CreateOrder(req)
	if err != nil {
		utils.InternalError(c, "Gagal membuat order: "+err.Error())
		return
	}

	utils.SuccessCreated(c, "Order berhasil dibuat", order)
}

// UpdateOrder menangani PUT /api/orders/:id
func (h *Handler) UpdateOrder(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Data update tidak valid: "+err.Error())
		return
	}

	order, err := h.OrderService.UpdateOrder(id, req)
	if err != nil {
		utils.NotFound(c, "Gagal mengupdate order: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Order berhasil diupdate", order)
}

// DeleteOrder menangani DELETE /api/orders/:id
func (h *Handler) DeleteOrder(c *gin.Context) {
	id := c.Param("id")

	if err := h.OrderService.DeleteOrder(id); err != nil {
		utils.NotFound(c, "Gagal menghapus order: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Order berhasil dihapus", nil)
}
