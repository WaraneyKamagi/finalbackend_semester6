import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OrderForm from '../components/Order/OrderForm'
import Card from '../components/ui/Card'
import { fetchServiceById } from '../utils/api'

const OrderPage = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true)
        const data = await fetchServiceById(serviceId)
        setService(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadService()
  }, [serviceId])

  const handleOrderSuccess = (order) => {
    navigate(`/payment/${order.id}`, {
      state: { orderId: order.id },
    })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center text-slate-200">
        Memuat layanan...
      </div>
    )
  }

  if (error || !service) {
    return (
      <Card className="mx-auto mt-10 max-w-3xl text-center text-red-200">
        {error || 'Layanan tidak ditemukan'}
      </Card>
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
          formulir order
        </p>
        <h1 className="text-4xl font-bold text-white">{service.name}</h1>
        <p className="text-slate-400">{service.description}</p>
      </div>
      <OrderForm service={service} onSuccess={handleOrderSuccess} />
    </div>
  )
}

export default OrderPage

