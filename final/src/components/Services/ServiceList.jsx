import ServiceCard from './ServiceCard'
import Card from '../ui/Card'

const ServiceList = ({ services = [], loading, error }) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse space-y-4">
            <div className="h-4 w-24 rounded bg-slate-800" />
            <div className="h-6 w-40 rounded bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-slate-800" />
            <div className="h-10 w-32 rounded bg-slate-800" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="text-center text-red-300">
        Gagal memuat layanan. {error}
      </Card>
    )
  }

  if (!services.length) {
    return (
      <Card className="text-center text-slate-300">
        Layanan belum tersedia.
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}

export default ServiceList

