import { useState } from 'react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import QRPaymentModal from './QRPaymentModal'
import { updateOrder } from '../../utils/api'

const paymentOptions = [
  { value: 'Transfer Bank', label: '🏦 Transfer Bank', description: 'PT JokiPro Gaming – BCA 1234567890' },
  { value: 'QRIS', label: '📱 QRIS All Payment', description: 'GoPay • OVO • DANA • BCA • BNI • ShopeePay' },
]

const currency = (v) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)

const PaymentForm = ({ order, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(paymentOptions[0].value)
  const [reference, setReference] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleSelectMethod = (v) => { setSelectedMethod(v); setFeedback('') }

  const handlePay = async () => {
    if (selectedMethod === 'QRIS') { setShowQR(true); return }
    setFeedback('')
    try {
      setLoading(true)
      const updated = await updateOrder(order.id, { status: 'Menunggu Konfirmasi', paymentMethod: selectedMethod, paymentReference: reference })
      setFeedback('✅ Pembayaran dikirim! Menunggu konfirmasi admin.')
      setTimeout(() => onSuccess?.(updated), 1000)
    } catch (e) {
      setFeedback('❌ ' + (e.message || 'Gagal mengirim pembayaran'))
    } finally { setLoading(false) }
  }

  const handleQRSuccess = () => { setShowQR(false); onSuccess?.() }

  return (
    <>
      <div className="space-y-6">
        {/* Ringkasan */}
        <Card className="space-y-3">
          <h3 className="text-base font-bold text-white">Ringkasan Order</h3>
          <div className="divide-y divide-white/5 rounded-xl border border-cyan-500/10 bg-[#0a0f1e] text-sm">
            <div className="flex justify-between px-4 py-2.5 text-slate-400"><span>Layanan</span><span className="text-white">{order.service?.name || order.serviceName}</span></div>
            <div className="flex justify-between px-4 py-2.5 text-slate-400"><span>Target</span><span className="text-white">{order.target}</span></div>
            <div className="flex justify-between px-4 py-2.5 text-slate-400"><span>Paket</span><span className="text-white">{order.tier?.toUpperCase()}</span></div>
            <div className="flex justify-between px-4 py-3 font-semibold"><span className="text-white">Total</span><span className="text-cyan-400">{currency(order.totalPrice)}</span></div>
          </div>
        </Card>

        {/* Metode */}
        <div className="rounded-2xl border border-cyan-500/10 bg-[#0c1220] p-6">
          <h3 className="mb-4 text-base font-bold text-white">Metode Pembayaran</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {paymentOptions.map((opt) => {
              const sel = selectedMethod === opt.value
              return (
                <div key={opt.value} role="button" tabIndex={0} onClick={() => handleSelectMethod(opt.value)} onKeyDown={(e) => e.key === 'Enter' && handleSelectMethod(opt.value)}
                  className={`cursor-pointer rounded-xl border p-4 text-left transition-all ${sel ? 'border-cyan-500 bg-cyan-500/10 text-white ring-1 ring-cyan-500/30' : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{opt.label}</p>
                    {sel && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] text-slate-950 font-bold">✓</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{opt.description}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4">
            {selectedMethod === 'QRIS' ? (
              <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-5 text-center">
                <p className="text-2xl mb-2">📱</p>
                <p className="text-sm font-semibold text-white">QR akan di-generate saat kamu klik tombol di bawah</p>
                <p className="mt-1 text-xs text-slate-500">Berlaku 10 menit · Terverifikasi otomatis</p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {['GoPay', 'OVO', 'DANA', 'BCA', 'BNI', 'ShopeePay'].map((a) => (
                    <span key={a} className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-0.5 text-[11px] text-cyan-400">{a}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-sm">
                <p className="font-semibold text-white">PT JokiPro Gaming</p>
                <p className="text-slate-400">No Rek: 1234567890 (BCA)</p>
                <p className="mt-1 text-xs text-slate-500">Berita transfer: <span className="font-mono text-cyan-400">ORDER-{order.id?.slice(0, 8)?.toUpperCase()}</span></p>
              </div>
            )}
          </div>
        </div>

        {selectedMethod !== 'QRIS' && (
          <Card className="space-y-3">
            <h3 className="text-base font-bold text-white">Bukti Transfer</h3>
            <Input label="Nomor Referensi" name="reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Contoh: TRF20260429001" />
          </Card>
        )}

        {feedback && (
          <p className={`rounded-xl border px-4 py-3 text-sm ${feedback.startsWith('✅') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>{feedback}</p>
        )}

        <button id="payment-action-btn" onClick={handlePay} disabled={loading}
          className="w-full rounded-xl bg-cyan-500 py-4 text-base font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]">
          {loading ? '⏳ Mengirim...' : selectedMethod === 'QRIS' ? '📱 Tampilkan QR Pembayaran' : '✅ Konfirmasi Pembayaran'}
        </button>
      </div>

      {showQR && <QRPaymentModal order={order} onClose={() => setShowQR(false)} onSuccess={handleQRSuccess} />}
    </>
  )
}

export default PaymentForm
