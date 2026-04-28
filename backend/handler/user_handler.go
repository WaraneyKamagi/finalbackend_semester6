// handler/user_handler.go
// Handler User: menangani HTTP request untuk fitur manajemen user.
// Hanya berisi logic HTTP: parsing request, memanggil service, mengirim response.

package handler

import (
	"github.com/finalbackend/backend/utils"
	"github.com/gin-gonic/gin"
)

// GetAllUsers menangani GET /api/users
// Mengembalikan semua user tanpa password (untuk keperluan admin)
func (h *Handler) GetAllUsers(c *gin.Context) {
	users, err := h.UserService.GetAllUsers()
	if err != nil {
		utils.InternalError(c, "Gagal mengambil data users: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Berhasil mengambil data users", users)
}

// GetUserByID menangani GET /api/users/:id
// Mengembalikan data user berdasarkan ID (tanpa password)
func (h *Handler) GetUserByID(c *gin.Context) {
	id := c.Param("id")

	user, err := h.UserService.GetUserByID(id)
	if err != nil {
		utils.NotFound(c, "User tidak ditemukan: "+err.Error())
		return
	}

	utils.SuccessOK(c, "Berhasil mengambil data user", user)
}
