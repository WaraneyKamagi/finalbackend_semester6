import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PaymentForm from '../components/Payment/PaymentForm'
import Card from '../components/ui/Card'
import { getOrderById } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const PaymentPage = () => {
  const { orderId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const data = await getOrderById(orderId)
        if (data.userId !== user.id) {
          throw new Error('Order tidak tersedia untuk akun ini')
        }
        setOrder(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      loadOrder()
    }
  }, [orderId, user?.id])

  const handlePaymentSuccess = () => {
    navigate('/orders')
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center text-slate-300">
        Memuat order...
      </div>
    )
  }

  if (error || !order) {
    return (
      <Card className="mx-auto mt-12 max-w-3xl text-center text-red-300">
        {error || 'Order tidak ditemukan'}
      </Card>
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-500">
          pembayaran order
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          Order #{order.id?.slice(0, 8)}
        </h1>
        <p className="mt-1 text-slate-400">
          Lengkapi pembayaran agar order segera diproses tim pilot.
        </p>
      </div>
      <PaymentForm order={order} onSuccess={handlePaymentSuccess} />
    </div>
  )
}

export default PaymentPage
