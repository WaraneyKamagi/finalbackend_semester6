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
        order.service?.name?.toLowerCase().includes(query.toLowerCase()) ||
        order.target?.toLowerCase().includes(query.toLowerCase())
      const matchStatus =
        statusFilter === 'ALL' || order.status === statusFilter
      return matchQuery && matchStatus
    })
  }, [orders, query, statusFilter])

  const handlePay = (orderId) => {
    navigate(`/payment/${orderId}`)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
          tracking order
        </p>
        <h1 className="text-4xl font-bold text-white">Order saya</h1>
        <p className="text-slate-400">
          Pantau status pembayaran dan progres push rank kamu.
        </p>
      </div>

      <Card className="grid gap-4 md:grid-cols-3">
        <Input
          label="Cari layanan / target"
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Contoh: Mythic, Push Rank"
        />
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium text-slate-100">Status</span>
          <select
            className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-100">
            Buat order baru
          </span>
          <Button onClick={() => navigate('/services')}>Pesan Layanan</Button>
        </div>
      </Card>

      {loading && (
        <Card className="text-center text-slate-200">Memuat order...</Card>
      )}

      {error && (
        <Card className="text-center text-red-200">
          Gagal memuat order: {error}
        </Card>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <Card className="text-center text-slate-300">
          Belum ada order yang sesuai filter.
        </Card>
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

