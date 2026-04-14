// handler/auth_handler.go
// Handler Auth: menangani HTTP request untuk fitur autentikasi (login & register).
// Hanya berisi logic HTTP: parsing request, memanggil service, mengirim response.

package handler

import (
	"github.com/finalbackend/backend/model"
	"github.com/finalbackend/backend/utils"
	"github.com/gin-gonic/gin"
)

// Login menangani POST /api/auth/login
func (h *Handler) Login(c *gin.Context) {
	var req model.LoginRequest

	// Parsing request body
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Data login tidak valid: "+err.Error())
		return
	}

	// Panggil service untuk proses login
	user, err := h.UserService.Login(req)
	if err != nil {
		utils.Unauthorized(c, err.Error())
		return
	}

	utils.SuccessOK(c, "Login berhasil", user)
}

// Register menangani POST /api/auth/register
func (h *Handler) Register(c *gin.Context) {
	var req model.RegisterRequest

	// Parsing request body
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Data registrasi tidak valid: "+err.Error())
		return
	}

	// Panggil service untuk proses registrasi
	user, err := h.UserService.Register(req)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}

	utils.SuccessCreated(c, "Registrasi berhasil", user)
}
