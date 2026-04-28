import { useEffect, useState } from 'react'
import ServiceList from '../components/Services/ServiceList'
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
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-500">
          Pricing & Services
        </p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Pilih layanan terbaikmu
        </h1>
        <p className="text-slate-400">
          Semua layanan dilengkapi pilot profesional, jadwal fleksibel, dan laporan harian.
        </p>
      </div>

      <ServiceList services={services} loading={loading} error={error} />

      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center">
        <h2 className="text-xl font-bold text-white">Butuh paket custom?</h2>
        <p className="mt-2 text-sm text-slate-400">
          Hubungi admin untuk request kombinasi rank / hero spesifik sesuai kebutuhanmu.
        </p>
        <a
          href="mailto:hello@jokitorang.com"
          className="mt-4 inline-flex items-center rounded-xl border border-cyan-500/40 px-6 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
        >
          Konsultasi Gratis
        </a>
      </div>
    </div>
  )
}

export default ServicesPage
