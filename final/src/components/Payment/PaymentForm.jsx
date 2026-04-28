import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { updateOrder } from '../../utils/api'

const paymentOptions = [
  {
    value: 'Transfer Bank',
    label: 'Transfer Bank BCA',
    description: 'PT JokiPro Gaming - 1234567890',
  },
  {
    value: 'QRIS',
    label: 'QRIS All Payment',
    description: 'Scan QR untuk bayar via e-wallet atau mobile banking',
  },
]

const currency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)

const PaymentForm = ({ order, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(paymentOptions[0].value)
  const [reference, setReference] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback('')

    try {
      setLoading(true)
      const updatedOrder = await updateOrder(order.id, {
        status: 'Menunggu Konfirmasi',
        paymentMethod: selectedMethod,
        paymentReference: reference,
      })
      setFeedback('Pembayaran dikirim! Menunggu konfirmasi admin.')
      setTimeout(() => onSuccess?.(updatedOrder), 700)
    } catch (error) {
      setFeedback(error.message || 'Gagal mengirim pembayaran')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Ringkasan Order</h3>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
          <div className="flex justify-between">
            <p>Layanan</p>
            <p className="text-white">
              {order.service?.name || order.serviceName}
            </p>
          </div>
          <div className="flex justify-between">
            <p>Target</p>
            <p className="text-white">{order.target}</p>
          </div>
          <div className="flex justify-between">
            <p>Paket</p>
            <p className="text-white">{order.tier?.toUpperCase()}</p>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold text-white">
            <p>Total</p>
            <p>{currency(order.totalPrice)}</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Metode Pembayaran</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {paymentOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={[
                'rounded-2xl border p-4 text-left transition',
                selectedMethod === option.value
                  ? 'border-indigo-500 bg-indigo-500/10 text-white'
                  : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700',
              ].join(' ')}
              onClick={() => setSelectedMethod(option.value)}
            >
              <p className="text-sm font-semibold uppercase tracking-wide">
                {option.label}
              </p>
              <p className="text-xs text-slate-400">{option.description}</p>
            </button>
          ))}
        </div>

        {selectedMethod === 'QRIS' ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="h-40 w-40 rounded-2xl bg-[radial-gradient(circle,_#6366f1,_#1e1b4b)] p-4 text-center text-white">
              QR
            </div>
            <p className="text-xs text-slate-400">
              Scan QR di atas menggunakan aplikasi pembayaran favoritmu.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-white">
            <p className="font-semibold">PT JokiPro Gaming</p>
            <p>No Rek: 1234567890 (BCA)</p>
            <p className="text-slate-400">
              Gunakan berita transfer: ORDER #{order.id}
            </p>
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Konfirmasi Pembayaran
        </h3>
        <Input
          label="Nomor Referensi / Catatan Pembayaran"
          name="reference"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          placeholder="Contoh: BANK123456"
        />
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium text-slate-100">
            Upload Bukti (opsional)
          </span>
          <input
            type="file"
            className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-8 text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-500/20 file:px-4 file:py-2 file:text-indigo-300"
          />
        </label>
      </Card>

      {feedback && (
        <Card
          className={`text-sm ${
            feedback.includes('berhasil') || feedback.includes('Menunggu')
              ? 'text-emerald-200'
              : 'text-red-200'
          }`}
        >
          {feedback}
        </Card>
      )}

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? 'Mengirim Pembayaran...' : 'Konfirmasi Pembayaran'}
      </Button>
    </form>
  )
}

export default PaymentForm

