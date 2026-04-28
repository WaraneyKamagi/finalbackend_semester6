import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'

const currency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const ServiceCard = ({ service }) => {
  const navigate = useNavigate()

  return (
    <Card className="flex h-full flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
          {service.eta}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          {service.name}
        </h3>
        <p className="mt-2 text-sm text-slate-300">{service.description}</p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            mulai dari
          </p>
          <p className="text-2xl font-bold text-white">{currency(service.basePrice)}</p>
        </div>
        <Button onClick={() => navigate(`/order/${service.id}`)}>
          Pesan
        </Button>
      </div>
    </Card>
  )
}

export default ServiceCard

