// handler/payment_handler.go
// Handler Payment: menangani generate token QR dan verifikasi pembayaran.
// Alur: frontend generate QR dari token → user scan → browser buka /pay/verify/:token
// → backend tandai order lunas → frontend polling status → tampilkan success popup.

package handler

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"sync"
	"time"

	"github.com/finalbackend/backend/model"
	"github.com/finalbackend/backend/utils"
	"github.com/gin-gonic/gin"
)

// paymentToken menyimpan satu token pembayaran sementara (in-memory, cukup untuk demo)
type paymentToken struct {
	OrderID   string
	Amount    int
	CreatedAt time.Time
	Verified  bool
}

// tokenStore menyimpan semua token aktif (thread-safe)
var (
	tokenStore   = make(map[string]*paymentToken)
	tokenStoreMu sync.RWMutex
)

// generateToken membuat token hex acak 32-karakter
func generateToken() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// GenerateQRToken menangani POST /api/payment/qr
// Membuat token unik untuk pembayaran QR dan mengembalikannya ke frontend.
// Frontend akan encode token ini menjadi QR code.
func (h *Handler) GenerateQRToken(c *gin.Context) {
	var req struct {
		OrderID string `json:"orderId" binding:"required"`
		Amount  int    `json:"amount" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Request tidak valid: "+err.Error())
		return
	}

	token, err := generateToken()
	if err != nil {
		utils.InternalError(c, "Gagal membuat token pembayaran")
		return
	}

	tokenStoreMu.Lock()
	tokenStore[token] = &paymentToken{
		OrderID:   req.OrderID,
		Amount:    req.Amount,
		CreatedAt: time.Now(),
		Verified:  false,
	}
	tokenStoreMu.Unlock()

	// QR code akan encode URL ini — ketika discan, browser buka endpoint verify
	verifyURL := fmt.Sprintf("http://localhost:8080/api/payment/verify/%s", token)

	utils.SuccessOK(c, "Token QR berhasil dibuat", gin.H{
		"token":     token,
		"verifyUrl": verifyURL,
		"expiresIn": 600, // 10 menit
	})
}

// VerifyQRPayment menangani GET /api/payment/verify/:token
// Endpoint ini dibuka ketika QR di-scan (oleh browser/kamera).
// Menandai token sebagai verified dan mengupdate status order.
func (h *Handler) VerifyQRPayment(c *gin.Context) {
	token := c.Param("token")

	tokenStoreMu.Lock()
	pt, exists := tokenStore[token]
	if !exists {
		tokenStoreMu.Unlock()
		c.Data(200, "text/html; charset=utf-8", paymentResultHTML("invalid"))
		return
	}

	if pt.Verified {
		tokenStoreMu.Unlock()
		c.Data(200, "text/html; charset=utf-8", paymentResultHTML("already"))
		return
	}

	if time.Since(pt.CreatedAt) > 10*time.Minute {
		delete(tokenStore, token)
		tokenStoreMu.Unlock()
		c.Data(200, "text/html; charset=utf-8", paymentResultHTML("expired"))
		return
	}

	// Tandai sebagai verified
	pt.Verified = true
	orderID := pt.OrderID
	tokenStoreMu.Unlock()

	// Update status order ke "Menunggu Konfirmasi"
	_, _ = h.OrderService.UpdateOrder(orderID, model.UpdateOrderRequest{
		Status:        "Menunggu Konfirmasi",
		PaymentMethod: "QRIS",
	})

	// Kembalikan halaman HTML sukses (yang tampil di browser saat scan)
	c.Data(200, "text/html; charset=utf-8", paymentResultHTML("success"))
}

// CheckQRStatus menangani GET /api/payment/status/:token
// Frontend polling endpoint ini setiap 2 detik untuk cek apakah QR sudah discan.
func (h *Handler) CheckQRStatus(c *gin.Context) {
	token := c.Param("token")

	tokenStoreMu.RLock()
	pt, exists := tokenStore[token]
	tokenStoreMu.RUnlock()

	if !exists {
		utils.NotFound(c, "Token tidak ditemukan atau sudah expired")
		return
	}

	if time.Since(pt.CreatedAt) > 10*time.Minute {
		tokenStoreMu.Lock()
		delete(tokenStore, token)
		tokenStoreMu.Unlock()
		utils.BadRequest(c, "Token sudah expired")
		return
	}

	utils.SuccessOK(c, "Status token", gin.H{
		"verified": pt.Verified,
		"orderId":  pt.OrderID,
	})
}

// paymentResultHTML menghasilkan halaman HTML yang tampil di browser setelah scan QR
func paymentResultHTML(state string) []byte {
	var icon, title, subtitle, color string
	switch state {
	case "success":
		icon = "✅"
		title = "Pembayaran Berhasil!"
		subtitle = "Terima kasih! Pesanan kamu sedang diproses oleh tim pilot."
		color = "#10b981"
	case "already":
		icon = "ℹ️"
		title = "Sudah Dibayar"
		subtitle = "Transaksi ini sudah berhasil diverifikasi sebelumnya."
		color = "#6366f1"
	case "expired":
		icon = "⏰"
		title = "QR Kadaluarsa"
		subtitle = "QR Code sudah expired (10 menit). Silakan buat QR baru."
		color = "#f59e0b"
	default:
		icon = "❌"
		title = "Token Tidak Valid"
		subtitle = "QR Code tidak dikenali. Pastikan kamu scan QR yang benar."
		color = "#ef4444"
	}

	html := fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>%s - HoK Joki Payment</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 24px;
      padding: 48px 32px;
      max-width: 400px;
      width: 100%%;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
    }
    .icon { font-size: 72px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 800; color: %s; margin-bottom: 12px; }
    .subtitle { font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px; }
    .badge {
      background: %s22;
      border: 1px solid %s44;
      color: %s;
      padding: 8px 20px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      display: inline-block;
    }
    .brand { margin-top: 32px; font-size: 12px; color: #475569; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">%s</div>
    <div class="title">%s</div>
    <div class="subtitle">%s</div>
    <div class="badge">HoK Joki · QRIS Payment</div>
    <div class="brand">hokjoki.com · Layanan Joki Honor of Kings</div>
  </div>
</body>
</html>`, title, color, color, color, color, icon, title, subtitle)

	return []byte(html)
}
