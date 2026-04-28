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
      <div className="mx-auto max-w-4xl px-4 py-10 text-center text-slate-200">
        Memuat order...
      </div>
    )
  }

  if (error || !order) {
    return (
      <Card className="mx-auto mt-10 max-w-3xl text-center text-red-200">
        {error || 'Order tidak ditemukan'}
      </Card>
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
          pembayaran order
        </p>
        <h1 className="text-4xl font-bold text-white">
          Order #{order.id.toString().padStart(4, '0')}
        </h1>
        <p className="text-slate-400">
          Lengkapi pembayaran agar order segera diproses tim pilot.
        </p>
      </div>
      <PaymentForm order={order} onSuccess={handlePaymentSuccess} />
    </div>
  )
}

export default PaymentPage

