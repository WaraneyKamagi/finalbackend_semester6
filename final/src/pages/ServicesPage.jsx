import { useEffect, useState } from 'react'
import ServiceList from '../components/Services/ServiceList'
import Card from '../components/ui/Card'
import { fetchServices } from '../utils/api'

const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)
        const data = await fetchServices()
        setServices(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
      <div className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
          katalog layanan
        </p>
        <h1 className="text-4xl font-bold text-white">Service terbaik kami</h1>
        <p className="text-slate-400">
          Semua layanan dilengkapi pilot profesional, jadwal fleksibel, dan
          laporan harian.
        </p>
      </div>

      <ServiceList services={services} loading={loading} error={error} />

      <Card className="space-y-4 bg-indigo-500/10 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Butuh paket custom?
        </h2>
        <p className="text-slate-300">
          Hubungi admin untuk request kombinasi rank / hero spesifik sesuai
          kebutuhanmu.
        </p>
        <a
          href="mailto:hello@jokigaming.com"
          className="inline-flex items-center justify-center rounded-2xl border border-indigo-400/60 px-6 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
        >
          Konsultasi Gratis
        </a>
      </Card>
    </div>
  )
}

export default ServicesPage

