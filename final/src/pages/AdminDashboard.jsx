import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import OrderDetail from '../components/Order/OrderDetail'
import { deleteOrder, fetchAllOrders, updateOrder } from '../utils/api'

const statusOptions = [
  'Menunggu Pembayaran',
  'Menunggu Konfirmasi',
  'Diproses',
  'Selesai',
  'Dibatalkan',
]

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState('')
  const [activeOrder, setActiveOrder] = useState(null)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchAllOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // Filter orders manual
  let filteredOrders = orders
  if (search) {
    filteredOrders = filteredOrders.filter((order) => {
      const query = search.toLowerCase()
      return (
        order?.service?.name?.toLowerCase().includes(query) ||
        order.target?.toLowerCase().includes(query) ||
        order?.user?.name?.toLowerCase().includes(query) ||
        order.id?.toString().includes(query)
      )
    })
  }

  if (statusFilter !== 'ALL') {
    filteredOrders = filteredOrders.filter((order) => order.status === statusFilter)
  }

  // Hitung stats manual
  const total = orders.length
  const counts = {}

  statusOptions.forEach(status => {
    counts[status] = 0
  })

  orders.forEach(order => {
    if (counts[order.status] !== undefined) {
      counts[order.status]++
    }
  })

  const stats = { total, counts }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      const updated = await updateOrder(orderId, { status: newStatus })
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
              ...order,
              ...updated,
            }
            : order,
        ),
      )
      setToast(`Status order #${orderId} diperbarui menjadi ${newStatus}`)
      setTimeout(() => setToast(''), 2500)
    } catch (err) {
      setToast(err.message || 'Gagal memperbarui status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    const confirmation = window.confirm(
      `Hapus order #${orderId.toString().padStart(4, '0')}?`,
    )
    if (!confirmation) return

    try {
      setDeletingId(orderId)
      await deleteOrder(orderId)
      setOrders((prev) => prev.filter((order) => order.id !== orderId))
      setToast(`Order #${orderId} berhasil dihapus`)
      setTimeout(() => setToast(''), 2500)
    } catch (err) {
      setToast(err.message || 'Gagal menghapus order')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
          admin dashboard
        </p>
        <h1 className="text-4xl font-bold text-white">Kelola Order</h1>
        <p className="text-slate-400">
          Pantau status pesanan, bantu proses pembayaran, dan update progres.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Total Order
          </p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </Card>
        {statusOptions.slice(0, 3).map((status) => (
          <Card key={status} className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {status}
            </p>
            <p className="text-3xl font-bold text-white">
              {stats.counts?.[status] ?? 0}
            </p>
          </Card>
        ))}
      </div>

      <Card className="grid gap-4 md:grid-cols-[2fr_1fr_auto]">
        <Input
          label="Cari order"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari berdasarkan user, layanan, order ID..."
        />
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium text-slate-100">Status</span>
          <select
            className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">Semua Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button onClick={loadOrders} variant="secondary" className="w-full">
            Refresh Data
          </Button>
        </div>
      </Card>

      {toast && (
        <Card className="text-sm text-emerald-200">{toast}</Card>
      )}

      {loading && (
        <Card className="text-center text-slate-300">Memuat data...</Card>
      )}

      {error && (
        <Card className="text-center text-red-200">
          Terjadi kesalahan: {error}
        </Card>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-3xl border border-slate-800">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.3em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Target</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-800/70 bg-slate-900/30"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">
                      #{order.id.toString().padStart(4, '0')}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString('id-ID')}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {order.user?.name || `User ${order.userId}`}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">
                      {order.service?.name || order.serviceName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Paket {order.tier?.toUpperCase()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-white">{order.target}</td>
                  <td className="px-6 py-4">
                    <select
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => setActiveOrder(order)}
                      >
                        Detail
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={deletingId === order.id}
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        {deletingId === order.id ? 'Menghapus...' : 'Hapus'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-6 text-center text-slate-400"
                  >
                    Tidak ada order untuk filter saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <OrderDetail
        order={activeOrder}
        isOpen={Boolean(activeOrder)}
        onClose={() => setActiveOrder(null)}
      />
    </div>
  )
}

export default AdminDashboard

