// handler/service_handler.go
// Handler Service: menangani HTTP request untuk fitur CRUD layanan/service.
// Hanya berisi logic HTTP: parsing request, memanggil service, mengirim response.

package handler

import (
	"github.com/finalbackend/backend/model"
	"github.com/finalbackend/backend/utils"
	"github.com/gin-gonic/gin"
)

// GetAllServices menangani GET /api/services
func (h *Handler) GetAllServices(c *gin.Context) {
	services, err := h.ServiceService.GetAllServices()
	if err != nil {
		utils.InternalError(c, "Gagal mengambil data layanan: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Berhasil mengambil data layanan", services)
}

// GetServiceByID menangani GET /api/services/:id
func (h *Handler) GetServiceByID(c *gin.Context) {
	id := c.Param("id")

	service, err := h.ServiceService.GetServiceByID(id)
	if err != nil {
		utils.NotFound(c, "Layanan tidak ditemukan: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Berhasil mengambil data layanan", service)
}

// CreateService menangani POST /api/services
func (h *Handler) CreateService(c *gin.Context) {
	var req model.CreateServiceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Data layanan tidak valid: "+err.Error())
		return
	}

	service, err := h.ServiceService.CreateService(req)
	if err != nil {
		utils.InternalError(c, "Gagal membuat layanan: "+err.Error())
		return
	}

	utils.SuccessCreated(c, "Layanan berhasil dibuat", service)
}

// UpdateService menangani PUT /api/services/:id
func (h *Handler) UpdateService(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateServiceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Data update tidak valid: "+err.Error())
		return
	}

	service, err := h.ServiceService.UpdateService(id, req)
	if err != nil {
		utils.NotFound(c, "Gagal mengupdate layanan: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Layanan berhasil diupdate", service)
}

// DeleteService menangani DELETE /api/services/:id
func (h *Handler) DeleteService(c *gin.Context) {
	id := c.Param("id")

	if err := h.ServiceService.DeleteService(id); err != nil {
		utils.NotFound(c, "Gagal menghapus layanan: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Layanan berhasil dihapus", nil)
}
