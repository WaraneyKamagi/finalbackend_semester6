import { useEffect, useState, useMemo } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import OrderDetail from '../components/Order/OrderDetail'
import { deleteOrder, fetchAllOrders, updateOrder } from '../utils/api'

const BASE_URL = 'http://localhost:8080/api'

const statusOptions = [
  'Menunggu Pembayaran',
  'Menunggu Konfirmasi',
  'Diproses',
  'Selesai',
  'Dibatalkan',
]

// Warna badge per status
const statusColor = {
  'Menunggu Pembayaran': 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  'Menunggu Konfirmasi': 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  'Diproses': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  'Selesai': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  'Dibatalkan': 'border-red-500/30 bg-red-500/10 text-red-300',
}

const currency = (v) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState({}) // { id: { name, email } }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState('')
  const [activeOrder, setActiveOrder] = useState(null)

  // Fetch semua user untuk mapping nama
  const loadUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        const map = {}
        json.data.forEach((u) => {
          map[u.id] = { name: u.name, email: u.email }
        })
        setUsers(map)
      }
    } catch {
      // silent — fallback ke UUID
    }
  }

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchAllOrders()
      setOrders(data || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    loadOrders()
  }, [])

  // Helper: ambil nama user dari map
  const getUserName = (userId) => users[userId]?.name || `User ${userId?.slice(0, 8)}...`
  const getUserEmail = (userId) => users[userId]?.email || ''

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = orders
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((o) => {
        const userName = getUserName(o.userId).toLowerCase()
        const serviceName = (o.serviceName || '').toLowerCase()
        const orderId = (o.id || '').toLowerCase()
        const target = (o.target || '').toLowerCase()
        return userName.includes(q) || serviceName.includes(q) || orderId.includes(q) || target.includes(q)
      })
    }
    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.status === statusFilter)
    }
    return result
  }, [orders, search, statusFilter, users])

  // Hitung stats
  const stats = useMemo(() => {
    const counts = {}
    statusOptions.forEach((s) => (counts[s] = 0))
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status]++
    })
    return { total: orders.length, counts }
  }, [orders])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      const updated = await updateOrder(orderId, { status: newStatus })
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o)),
      )
      showToast(`✅ Status berhasil diubah ke "${newStatus}"`)
    } catch (err) {
      showToast(`❌ ${err.message || 'Gagal memperbarui status'}`)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Hapus order #${orderId.slice(0, 8)}?`)) return
    try {
      setDeletingId(orderId)
      await deleteOrder(orderId)
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      showToast('🗑️ Order berhasil dihapus')
    } catch (err) {
      showToast(`❌ ${err.message || 'Gagal menghapus order'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleRefresh = () => {
    loadUsers()
    loadOrders()
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-500">
          admin dashboard
        </p>
        <h1 className="text-4xl font-bold text-white">Kelola Order</h1>
        <p className="text-slate-400">
          Pantau status pesanan, bantu proses pembayaran, dan update progres.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total Order</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </Card>
        {statusOptions.slice(0, 3).map((status) => (
          <Card key={status} className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{status}</p>
            <p className="text-3xl font-bold text-white">{stats.counts[status] ?? 0}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="grid gap-4 md:grid-cols-[2fr_1fr_auto]">
        <Input
          label="Cari order"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan user, layanan, order ID..."
        />
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium text-slate-100">Status</span>
          <select
            className="rounded-xl border border-cyan-500/10 bg-[#0a0f1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button onClick={handleRefresh} variant="secondary" className="w-full">
            Refresh Data
          </Button>
        </div>
      </Card>

      {/* Toast */}
      {toast && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/90 px-5 py-3 text-sm text-slate-200 shadow-lg">
          {toast}
        </div>
      )}

      {/* Loading / Error */}
      {loading && <Card className="text-center text-slate-300">Memuat data...</Card>}
      {error && <Card className="text-center text-red-200">Terjadi kesalahan: {error}</Card>}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-3xl border border-slate-800">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.3em] text-slate-400">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Layanan</th>
                <th className="px-5 py-4">Target</th>
                <th className="px-5 py-4">Harga</th>
                <th className="px-5 py-4 min-w-[200px]">Status</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-800/70 transition hover:bg-slate-800/30"
                >
                  {/* Order ID */}
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs font-semibold text-white">
                      #{order.id?.slice(0, 8)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString('id-ID', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })
                        : '-'}
                    </p>
                  </td>

                  {/* User */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{getUserName(order.userId)}</p>
                    <p className="text-xs text-slate-500">{getUserEmail(order.userId)}</p>
                  </td>

                  {/* Layanan */}
                  <td className="px-5 py-4">
                    <p className="text-white">{order.serviceName || '-'}</p>
                    <p className="text-xs text-slate-500">Paket {order.tier?.toUpperCase()}</p>
                  </td>

                  {/* Target */}
                  <td className="px-5 py-4 text-white">{order.target}</td>

                  {/* Harga */}
                  <td className="px-5 py-4 font-medium text-cyan-400">
                    {currency(order.totalPrice)}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-4">
                    <select
                      id={`status-${order.id}`}
                      className={`w-full min-w-[180px] rounded-xl border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${
                        statusColor[order.status] || 'border-slate-700 bg-slate-800 text-white'
                      }`}
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Aksi */}
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveOrder(order)}
                        className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingId === order.id}
                        className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {deletingId === order.id ? '...' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada order untuk filter saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetail
        order={activeOrder}
        isOpen={Boolean(activeOrder)}
        onClose={() => setActiveOrder(null)}
      />
    </div>
  )
}

export default AdminDashboard
