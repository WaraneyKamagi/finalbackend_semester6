import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderCard from '../components/Order/OrderCard'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { getUserOrders } from '../utils/api'

const statusOptions = [
  'ALL',
  'Menunggu Pembayaran',
  'Menunggu Konfirmasi',
  'Diproses',
  'Selesai',
  'Dibatalkan',
]

const OrdersPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const data = await getUserOrders(user.id)
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      loadOrders()
    }
  }, [user?.id])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchQuery =
        (order.serviceName || '').toLowerCase().includes(query.toLowerCase()) ||
        (order.target || '').toLowerCase().includes(query.toLowerCase())
      const matchStatus =
        statusFilter === 'ALL' || order.status === statusFilter
      return matchQuery && matchStatus
    })
  }, [orders, query, statusFilter])

  const handlePay = (orderId) => {
    navigate(`/payment/${orderId}`)
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-500">
          tracking order
        </p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Order saya</h1>
        <p className="text-slate-400">
          Pantau status pembayaran dan progres push rank kamu.
        </p>
      </div>

      <Card className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Cari layanan / target"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Contoh: Mythic, Push Rank"
        />
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-300">Status</span>
          <select
            className="rounded-xl border border-cyan-500/10 bg-[#0a0f1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'Semua Status' : status}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Buat order baru</span>
          <Button onClick={() => navigate('/services')}>Pesan Layanan</Button>
        </div>
      </Card>

      {loading && <Card className="text-center text-slate-300">Memuat order...</Card>}
      {error && <Card className="text-center text-red-300">Gagal memuat order: {error}</Card>}
      {!loading && !error && filteredOrders.length === 0 && (
        <Card className="text-center text-slate-400">Belum ada order yang sesuai filter.</Card>
      )}

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} onPay={handlePay} />
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
