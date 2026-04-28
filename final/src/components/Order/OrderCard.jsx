import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import OrderDetail from './OrderDetail'

const statusStyles = {
  'Menunggu Pembayaran': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  'Menunggu Konfirmasi': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  Diproses: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  Selesai: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Dibatalkan: 'bg-red-500/10 text-red-300 border-red-500/30',
}

const formatDate = (dateString) =>
  new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

const currency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)

const OrderCard = ({ order, onPay }) => {
  const [showDetail, setShowDetail] = useState(false)
  const serviceName = order.service?.name || order.serviceName
  const statusClass = statusStyles[order.status] || 'bg-slate-800/60 text-slate-300'

  return (
    <>
      <Card className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="font-mono text-xs text-slate-500">
              #{order.id?.slice(0, 8)}
            </p>
            <h3 className="text-lg font-bold text-white sm:text-xl">{serviceName}</h3>
            <p className="text-sm text-slate-500">
              {order.createdAt ? `Dibuat ${formatDate(order.createdAt)}` : ''}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClass}`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Target</p>
            <p className="text-white">{order.target}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Paket</p>
            <p className="text-white">{order.tier?.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total</p>
            <p className="text-white">{currency(order.totalPrice)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => setShowDetail(true)}>
            Lihat Detail
          </Button>
          {order.status === 'Menunggu Pembayaran' && (
            <Button onClick={() => onPay?.(order.id)}>Lanjut Pembayaran</Button>
          )}
        </div>
      </Card>

      <OrderDetail
        order={order}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  )
}

export default OrderCard
