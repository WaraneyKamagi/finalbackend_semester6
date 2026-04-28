import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const BASE_URL = 'http://localhost:8080/api'
const currency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
const POLL_INTERVAL = 2000
const QR_EXPIRY = 600

const SuccessPopup = ({ order, onClose }) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0c1220] shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
      <div className="relative flex flex-col items-center gap-5 px-8 py-10 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500/20" />
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-4xl">✅</div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Pembayaran Berhasil!</h2>
          <p className="mt-1 text-sm text-emerald-400">QR berhasil discan dan diverifikasi</p>
        </div>
        <div className="w-full rounded-xl border border-white/5 bg-[#0a0f1e] p-4 text-sm text-slate-400">
          <div className="flex justify-between py-1"><span>Layanan</span><span className="text-white">{order.serviceName}</span></div>
          <div className="flex justify-between py-1"><span>Metode</span><span className="text-white">QRIS</span></div>
          <div className="flex justify-between border-t border-white/5 pt-2 mt-1 font-semibold"><span className="text-white">Total</span><span className="text-emerald-400">{currency(order.totalPrice)}</span></div>
        </div>
        <button onClick={onClose} className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 active:scale-95">
          Lihat Status Order →
        </button>
      </div>
    </div>
  </div>
)

const QRPaymentModal = ({ order, onClose, onSuccess }) => {
  const [qrData, setQrData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [secs, setSecs] = useState(QR_EXPIRY)
  const [scanned, setScanned] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const pollRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await fetch(`${BASE_URL}/payment/qr`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id, amount: order.totalPrice }) })
        const json = await res.json()
        if (!json.success) throw new Error(json.message)
        setQrData(json.data)
      } catch (e) { setError(e.message || 'Gagal membuat QR') } finally { setLoading(false) }
    })()
  }, [order.id, order.totalPrice])

  useEffect(() => {
    if (!qrData || scanned) return
    timerRef.current = setInterval(() => setSecs((s) => { if (s <= 1) { clearInterval(timerRef.current); setError('QR expired. Tutup dan coba lagi.'); return 0 } return s - 1 }), 1000)
    return () => clearInterval(timerRef.current)
  }, [qrData, scanned])

  useEffect(() => {
    if (!qrData?.token || scanned) return
    pollRef.current = setInterval(async () => {
      try { const res = await fetch(`${BASE_URL}/payment/status/${qrData.token}`); const json = await res.json(); if (json.data?.verified) { clearInterval(pollRef.current); clearInterval(timerRef.current); setScanned(true); setShowSuccess(true) } } catch {}
    }, POLL_INTERVAL)
    return () => clearInterval(pollRef.current)
  }, [qrData, scanned])

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  const pct = (secs / QR_EXPIRY) * 100
  const col = secs > 120 ? '#06b6d4' : secs > 30 ? '#f59e0b' : '#ef4444'

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-cyan-500/15 bg-[#0c1220] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-cyan-600 to-cyan-500 px-5 py-3.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-100/70">Pembayaran QRIS</p>
              <p className="text-lg font-black text-white">{currency(order.totalPrice)}</p>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white transition hover:bg-white/25">✕</button>
          </div>

          <div className="flex flex-col items-center gap-5 p-6">
            {loading ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <p className="text-sm text-slate-500">Membuat QR...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300">{error}</div>
            ) : (
              <>
                <div className="relative rounded-xl bg-white p-3.5 shadow-xl shadow-black/40">
                  <QRCodeSVG id="qr-payment-code" value={qrData.verifyUrl} size={180} level="H" />
                  {scanned && <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-emerald-500/90"><span className="text-4xl">✅</span></div>}
                </div>

                {/* Timer */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative h-12 w-12">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                      <circle cx="22" cy="22" r="18" fill="none" stroke={col} strokeWidth="3.5" strokeDasharray={`${2 * Math.PI * 18}`} strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-[10px] font-bold" style={{ color: col }}>{fmt(secs)}</span></div>
                  </div>
                  <p className="text-[11px] text-slate-500">Berlaku {fmt(secs)}</p>
                </div>

                <div className="w-full space-y-1.5 rounded-xl border border-cyan-500/10 bg-[#0a0f1e] px-4 py-3 text-[11px] text-slate-500">
                  <p className="font-semibold text-slate-300">Cara bayar:</p>
                  <p>1. Buka e-wallet / mobile banking</p>
                  <p>2. Pilih menu <strong className="text-white">Scan QR</strong></p>
                  <p>3. Scan QR di atas — otomatis terverifikasi</p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />Menunggu pembayaran...
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showSuccess && <SuccessPopup order={order} onClose={() => { setShowSuccess(false); onSuccess?.() }} />}
    </>
  )
}

export default QRPaymentModal
