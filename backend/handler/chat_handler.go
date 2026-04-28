// handler/chat_handler.go
// Handler Chat: menangani HTTP request untuk fitur chatbot konsultasi gratis.
// Menggunakan rule-based AI dengan konteks layanan Honor of Kings boosting.

package handler

import (
	"strings"

	"github.com/finalbackend/backend/model"
	"github.com/finalbackend/backend/utils"
	"github.com/gin-gonic/gin"
)

// knowledgeBase menyimpan pengetahuan chatbot tentang layanan joki HoK
type chatRule struct {
	keywords []string
	reply    string
	suggestions []string
}

var knowledgeBase = []chatRule{
	{
		keywords: []string{"harga", "biaya", "berapa", "tarif", "bayar", "cost", "price"},
		reply:    "💰 Harga layanan kami tergantung pada paket yang dipilih:\n\n• **Push Rank Glory** mulai dari Rp 50.000/tier\n• **Power Score Boost** mulai dari Rp 75.000\n• **Pilot Mode** (akun dikelola pilot) mulai dari Rp 100.000\n• **Hero Mastery** mulai dari Rp 60.000\n\nSemua harga sudah termasuk garansi keamanan akun. Cek halaman Services untuk detail lengkap!",
		suggestions: []string{"Bagaimana cara order?", "Apakah aman?", "Berapa lama prosesnya?"},
	},
	{
		keywords: []string{"aman", "keamanan", "safe", "akun", "banned", "hack", "risiko"},
		reply:    "🛡️ Keamanan akun adalah prioritas utama kami!\n\n• Pilot kami menggunakan VPN dengan IP region yang sama\n• Tidak pernah menggunakan cheat/bot\n• Password akun dienkripsi dan tidak disimpan setelah order selesai\n• Track record 500+ order tanpa kasus banned\n• Jaminan uang kembali jika terjadi masalah\n\nAkun kamu 100% aman bersama tim kami! ✅",
		suggestions: []string{"Berapa harganya?", "Berapa lama prosesnya?", "Bagaimana cara order?"},
	},
	{
		keywords: []string{"lama", "berapa lama", "durasi", "waktu", "cepat", "selesai", "estimasi", "eta"},
		reply:    "⏱️ Estimasi waktu pengerjaan:\n\n• **Push 1 tier** (misal Bronze → Silver): 1-2 hari\n• **Push Glory Rank** (Epic → Legend): 3-5 hari\n• **Mythic Star Push** (per 10 bintang): 2-3 hari\n• **Power Score**: tergantung target, rata-rata 2-4 hari\n\nKami selalu update progress harian via chat. Jadwal pilot aktif: **08.00 - 24.00 WIB**",
		suggestions: []string{"Berapa harganya?", "Apakah aman?", "Bagaimana cara bayar?"},
	},
	{
		keywords: []string{"cara", "order", "pesan", "daftar", "register", "mulai", "langkah", "step"},
		reply:    "📋 Cara order sangat mudah:\n\n1. **Daftar akun** di website kami\n2. Pilih **layanan** yang kamu inginkan\n3. Isi **form order** (hero, rank saat ini, target)\n4. Lakukan **pembayaran**\n5. Tim kami akan **menghubungi kamu** dalam 1 jam\n6. Pilot mulai mengerjakan dan **update progress** setiap hari!\n\nMau langsung order? Klik tombol 'Pesan Joki HoK' di halaman utama! 🎮",
		suggestions: []string{"Berapa harganya?", "Metode pembayaran apa saja?", "Apakah aman?"},
	},
	{
		keywords: []string{"bayar", "payment", "transfer", "dana", "gopay", "ovo", "bca", "bni", "mandiri", "qris"},
		reply:    "💳 Metode pembayaran yang kami terima:\n\n• **Transfer Bank**: BCA, BNI, Mandiri, BRI\n• **E-Wallet**: GoPay, OVO, DANA, ShopeePay\n• **QRIS** (semua aplikasi)\n\nPembayaran dilakukan setelah konfirmasi order. Tidak ada biaya tambahan!",
		suggestions: []string{"Bagaimana cara order?", "Berapa harganya?", "Ada diskon?"},
	},
	{
		keywords: []string{"diskon", "promo", "voucher", "hemat", "murah", "gratis"},
		reply:    "🎉 Promo & Diskon:\n\n• **First Order**: Diskon 10% untuk order pertama (gunakan kode: FIRSTHOK)\n• **Bundle Order**: Beli 2 paket, gratis 1 tier push\n• **Referral**: Ajak teman, dapat cashback Rp 20.000\n• **Member Setia**: Diskon 15% setelah 3x order\n\nFollow Instagram kami untuk promo terbaru! 📱",
		suggestions: []string{"Bagaimana cara order?", "Berapa harganya?", "Apakah aman?"},
	},
	{
		keywords: []string{"hero", "karakter", "pilot", "main", "role", "marksman", "assassin", "mage", "tank", "support", "fighter"},
		reply:    "🎮 Layanan Hero Spesifik:\n\nPilot kami mahir semua role di Honor of Kings:\n• **Marksman**: Li Bai, Sun Quan, Luban\n• **Assassin**: Milady, Ma Chao, Hana\n• **Mage**: Diaochan, Zhuge Liang, Xi Shi\n• **Tank**: Lian Po, Cao Cao, Han Xin\n• **Support**: Sun Shangxiang, Da Qiao\n\nKamu bisa request hero favorit saat order!",
		suggestions: []string{"Berapa harganya?", "Berapa lama prosesnya?", "Bagaimana cara order?"},
	},
	{
		keywords: []string{"rank", "glory", "mythic", "legend", "epic", "gold", "silver", "bronze", "bintang", "star", "tier"},
		reply:    "🏆 Layanan Push Rank Honor of Kings:\n\n• Bronze → Silver: Rp 50.000\n• Silver → Gold: Rp 75.000\n• Gold → Platinum: Rp 100.000\n• Platinum → Diamond: Rp 150.000\n• Diamond → Epic: Rp 200.000\n• Epic → Legend: Rp 300.000\n• Legend → Mythic: Rp 500.000\n• Mythic Star Push (per 10⭐): Rp 250.000\n\nTermasuk garansi tidak turun rank!",
		suggestions: []string{"Apakah aman?", "Berapa lama prosesnya?", "Bagaimana cara order?"},
	},
	{
		keywords: []string{"kontak", "hubungi", "whatsapp", "wa", "cs", "customer service", "support", "bantuan", "help"},
		reply:    "📞 Hubungi Tim Kami:\n\n• **WhatsApp**: +62 812-3456-7890 (24 jam)\n• **Instagram**: @hokjoki.official\n• **Email**: support@hokjoki.com\n• **Live Chat**: Langsung di sini! 💬\n\nResponse time rata-rata < 5 menit di jam aktif (08.00 - 24.00 WIB)",
		suggestions: []string{"Bagaimana cara order?", "Berapa harganya?", "Apakah aman?"},
	},
	{
		keywords: []string{"refund", "uang kembali", "gagal", "cancel", "batal", "komplain", "kecewa"},
		reply:    "🔄 Kebijakan Refund & Garansi:\n\n• **Full Refund** jika order tidak bisa dikerjakan dalam 24 jam\n• **Partial Refund** proporsional jika dikerjakan sebagian\n• **Garansi Rank** tidak turun selama 7 hari setelah selesai\n• **Re-do Gratis** jika target tidak tercapai karena kesalahan pilot\n\nKepuasan kamu adalah prioritas kami! 🙏",
		suggestions: []string{"Bagaimana cara order?", "Apakah aman?", "Hubungi CS"},
	},
	{
		keywords: []string{"halo", "hai", "hi", "hello", "selamat", "pagi", "siang", "malam", "sore", "hei"},
		reply:    "👋 Halo! Selamat datang di Konsultasi Gratis HoK Joki!\n\nSaya siap membantu kamu mendapatkan informasi tentang:\n• 🏆 Layanan push rank Honor of Kings\n• 💰 Harga & promo terbaru\n• 🛡️ Keamanan akun\n• ⏱️ Estimasi waktu pengerjaan\n\nAda yang ingin kamu tanyakan? 😊",
		suggestions: []string{"Berapa harganya?", "Apakah aman?", "Bagaimana cara order?"},
	},
	{
		keywords: []string{"terima kasih", "makasih", "thanks", "thank you", "oke", "ok", "siap", "mantap", "bagus"},
		reply:    "😊 Sama-sama! Senang bisa membantu!\n\nJika ada pertanyaan lain, jangan ragu untuk tanya ya. Tim kami selalu siap membantu 24/7.\n\nSelamat gaming dan semoga cepat naik rank! 🎮⚔️",
		suggestions: []string{"Bagaimana cara order?", "Lihat layanan kami", "Hubungi CS"},
	},
}

// defaultReply digunakan jika tidak ada keyword yang cocok
const defaultReply = `🤖 Maaf, saya belum mengerti pertanyaanmu.

Saya bisa membantu dengan:
• 💰 **Harga** layanan joki HoK
• 🛡️ **Keamanan** akun
• ⏱️ **Estimasi** waktu
• 📋 **Cara order**
• 💳 **Metode pembayaran**
• 🎉 **Promo & diskon**

Coba tanyakan salah satu topik di atas, atau hubungi CS kami langsung!`

var defaultSuggestions = []string{"Berapa harganya?", "Apakah aman?", "Bagaimana cara order?", "Hubungi CS"}

// Chat menangani POST /api/chat
// Menerima pesan dari user dan mengembalikan balasan chatbot
func (h *Handler) Chat(c *gin.Context) {
	var req model.ChatRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "Request tidak valid: "+err.Error())
		return
	}

	msg := strings.ToLower(strings.TrimSpace(req.Message))

	// Cari rule yang cocok dengan keyword
	for _, rule := range knowledgeBase {
		for _, keyword := range rule.keywords {
			if strings.Contains(msg, keyword) {
				utils.SuccessOK(c, "Berhasil", model.ChatResponse{
					Reply:       rule.reply,
					Suggestions: rule.suggestions,
				})
				return
			}
		}
	}

	// Tidak ada yang cocok — gunakan default reply
	utils.SuccessOK(c, "Berhasil", model.ChatResponse{
		Reply:       defaultReply,
		Suggestions: defaultSuggestions,
	})
}
