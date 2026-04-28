import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import OrderDetail from './OrderDetail'

const statusStyles = {
  'Menunggu Pembayaran': 'bg-yellow-500/10 text-yellow-200 border-yellow-500/40',
  'Menunggu Konfirmasi':
    'bg-orange-500/10 text-orange-200 border-orange-500/40',
  Diproses: 'bg-sky-500/10 text-sky-200 border-sky-500/40',
  Selesai: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/40',
  Dibatalkan: 'bg-red-500/10 text-red-200 border-red-500/40',
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
  const statusClass =
    statusStyles[order.status] || 'bg-slate-800/60 text-slate-300'

  return (
    <>
      <Card className="space-y-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              #{order.id.toString().padStart(4, '0')}
            </p>
            <h3 className="text-xl font-semibold text-white">{serviceName}</h3>
            <p className="text-sm text-slate-400">
              Dibuat {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={[
              'inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide border',
              statusClass,
            ].join(' ')}
          >
            {order.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-300">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Target
            </p>
            <p className="text-white">{order.target}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Paket
            </p>
            <p className="text-white">{order.tier?.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Total
            </p>
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

