// utils/response.go
// Response Helper: menyediakan format response JSON yang standar dan konsisten.
// Semua handler wajib menggunakan fungsi-fungsi di file ini untuk mengirim response.
// Format: { "success": bool, "message": string, "data": any }

package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// APIResponse adalah struktur standar response JSON
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// SuccessResponse mengirim response sukses dengan data
func SuccessResponse(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// ErrorResponse mengirim response error
func ErrorResponse(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, APIResponse{
		Success: false,
		Message: message,
		Data:    nil,
	})
}

// SuccessOK adalah shortcut untuk response 200 OK
func SuccessOK(c *gin.Context, message string, data interface{}) {
	SuccessResponse(c, http.StatusOK, message, data)
}

// SuccessCreated adalah shortcut untuk response 201 Created
func SuccessCreated(c *gin.Context, message string, data interface{}) {
	SuccessResponse(c, http.StatusCreated, message, data)
}

// BadRequest adalah shortcut untuk response 400 Bad Request
func BadRequest(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusBadRequest, message)
}

// Unauthorized adalah shortcut untuk response 401 Unauthorized
func Unauthorized(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusUnauthorized, message)
}

// Forbidden adalah shortcut untuk response 403 Forbidden
func Forbidden(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusForbidden, message)
}

// NotFound adalah shortcut untuk response 404 Not Found
func NotFound(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusNotFound, message)
}

// InternalError adalah shortcut untuk response 500 Internal Server Error
func InternalError(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusInternalServerError, message)
}
