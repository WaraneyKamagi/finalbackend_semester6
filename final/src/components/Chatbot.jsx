import { useState, useRef, useEffect } from 'react'

const BASE_URL = 'http://localhost:8080/api'

const WELCOME_MESSAGE = {
  role: 'bot',
  content:
    '👋 Halo! Saya **HoK Assistant** — konsultan virtual gratis untuk layanan boosting Honor of Kings.\n\nAda yang bisa saya bantu? 😊',
  suggestions: ['Berapa harganya?', 'Apakah aman?', 'Bagaimana cara order?'],
}

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-semibold text-cyan-300">{part}</strong>
          ) : (
            part
          ),
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    )
  })
}

const TypingDots = () => (
  <div className="flex items-end gap-2">
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
      AI
    </div>
    <div className="rounded-xl rounded-bl-sm bg-[#0c1220] border border-cyan-500/10 px-4 py-2.5">
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
)

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  useEffect(() => { if (isOpen) { setHasNew(false); setTimeout(() => inputRef.current?.focus(), 150) } }, [isOpen])

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg || isTyping) return
    setInput('')
    setMessages((p) => [...p, { role: 'user', content: msg }])
    setIsTyping(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      })
      const json = await res.json()
      await new Promise((r) => setTimeout(r, 500))
      setMessages((p) => [...p, { role: 'bot', content: json.data.reply, suggestions: json.data.suggestions || [] }])
    } catch {
      setMessages((p) => [...p, { role: 'bot', content: '❌ Koneksi gagal. Coba lagi ya!', suggestions: ['Coba lagi'] }])
    } finally {
      setIsTyping(false)
      if (!isOpen) setHasNew(true)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  return (
    <>
      {/* ── Toggle Button ── */}
      <button
        id="chatbot-toggle"
        onClick={() => setIsOpen((p) => !p)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 focus:outline-none sm:bottom-6 sm:right-6"
        aria-label="Toggle chat"
      >
        {hasNew && !isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">1</span>
        )}
        <span className="text-xl transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : '' }}>
          {isOpen ? '✕' : '💬'}
        </span>
      </button>

      {/* ── Chat Window ── */}
      <div
        className={`fixed z-50 flex flex-col overflow-hidden border border-cyan-500/15 bg-[#060a13] shadow-2xl shadow-black/60 transition-all duration-400 ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-90 pointer-events-none'
        } bottom-0 right-0 h-full w-full sm:bottom-24 sm:right-6 sm:h-auto sm:max-h-[520px] sm:w-[360px] sm:rounded-2xl`}
        style={{ transformOrigin: 'bottom right' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-sm font-bold text-white">🤖</div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-cyan-500 bg-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">HoK Assistant</p>
            <p className="text-[11px] text-cyan-100/70">Konsultasi Gratis • Online</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/20 hover:text-white"
          >✕</button>
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" style={{ minHeight: '280px', maxHeight: 'calc(100vh - 140px)' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'bot' && (
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-[10px] font-bold text-cyan-400">AI</div>
              )}
              {msg.role === 'user' && (
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700 text-[10px] font-bold text-slate-300">U</div>
              )}
              <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`} style={{ maxWidth: '80%' }}>
                <div className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-cyan-500 text-slate-950'
                    : 'rounded-bl-sm border border-cyan-500/10 bg-[#0c1220] text-slate-200'
                }`}>
                  {formatMessage(msg.content)}
                </div>
                {msg.role === 'bot' && msg.suggestions?.length > 0 && i === messages.length - 1 && (
                  <div className="flex flex-wrap gap-1">
                    {msg.suggestions.map((s, si) => (
                      <button
                        key={si}
                        onClick={() => sendMessage(s)}
                        className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 text-[11px] text-cyan-400 transition hover:bg-cyan-500/15"
                      >{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && <TypingDots />}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-cyan-500/10 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-cyan-500/10 bg-[#0c1220] px-3 py-2 focus-within:border-cyan-500/30 transition">
            <input
              ref={inputRef}
              id="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ketik pertanyaan..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <button
              id="chatbot-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.5}>
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chatbot
