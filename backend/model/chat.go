// model/chat.go
// Model Chat: mendefinisikan struktur request & response untuk fitur chatbot konsultasi.

package model

// ChatMessage merepresentasikan satu pesan dalam percakapan
type ChatMessage struct {
	Role    string `json:"role"`    // "user" atau "bot"
	Content string `json:"content"` // isi pesan
}

// ChatRequest adalah payload request ke endpoint /api/chat
type ChatRequest struct {
	Message  string        `json:"message" binding:"required"`
	History  []ChatMessage `json:"history"`
}

// ChatResponse adalah response dari endpoint /api/chat
type ChatResponse struct {
	Reply   string `json:"reply"`
	Suggestions []string `json:"suggestions,omitempty"`
}
