import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceList from '../components/Services/ServiceList'
import { fetchServices } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import hokLogo from '../assets/Mayene-Honor-of-Kings.webp'

const stats = [
  { value: '500+', label: 'Orders Completed' },
  { value: '98%', label: 'Success Rate' },
  { value: '24/7', label: 'Live Support' },
]

const steps = [
  { num: '01', title: 'Pilih Layanan', desc: 'Pilih paket boosting yang sesuai kebutuhanmu.' },
  { num: '02', title: 'Isi Detail Akun', desc: 'Masukkan info akun game & target rank yang diinginkan.' },
  { num: '03', title: 'Bayar & Santai', desc: 'Pilot pro kami mulai bekerja — pantau progres real-time.' },
]

const testimonials = [
  { name: 'Fajar', role: 'Pro Player', quote: 'Push Mythic 50 star selesai 3 hari, komunikasi super responsif!', rating: 5 },
  { name: 'Intan', role: 'Content Creator', quote: 'Pilotnya rapi, akun aman, update progres tiap hari. Highly recommended.', rating: 5 },
  { name: 'Rendy', role: 'Student', quote: 'Harga sesuai kualitas. Bisa request hero favorit, hasilnya memuaskan!', rating: 5 },
]

const LandingPage = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated } = useAuth()

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
    <div className="flex flex-1 flex-col bg-[#060a13]">

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.12),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left — text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-widest text-cyan-400">
                  Professional Game Pilots
                </span>
              </div>

              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Ascend to Your{' '}
                <span className="text-gradient-cyan">True Potential</span>
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
                Tim pilot profesional HoK siap push rank, tingkatkan Power Score,
                dan jaga akun tetap aman dengan update progres real-time.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/services')}
                  className="rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 hover:shadow-cyan-500/40 active:scale-95"
                >
                  Mulai Boosting →
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/login')}
                    className="rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-500/30 hover:text-white"
                  >
                    Login Dashboard
                  </button>
                )}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8 pt-4 sm:gap-12">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-black text-white sm:text-4xl">{s.value}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="absolute h-80 w-80 rounded-full border border-cyan-500/10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute h-64 w-64 rounded-full border border-cyan-500/20 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="relative h-72 w-72 overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-slate-900/60 p-6 shadow-2xl glow-cyan">
                <img
                  src={hokLogo}
                  alt="Honor of Kings"
                  className="h-full w-full object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="border-t border-cyan-500/5 bg-[#080d18]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-500">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Proses simpel, hasil maksimal
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="group rounded-2xl border border-cyan-500/10 bg-[#0c1220] p-8 transition hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <span className="text-4xl font-black text-cyan-500/20 transition group-hover:text-cyan-500/40">
                  {step.num}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section id="services" className="border-t border-cyan-500/5">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-500">
              Pricing & Services
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Pilih paket boosting HoK mu
            </h2>
            <p className="mt-3 text-slate-400">
              Semua paket termasuk pilot profesional, jadwal fleksibel, dan laporan harian.
            </p>
          </div>
          <ServiceList services={services} loading={loading} error={error} />
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section id="testimoni" className="border-t border-cyan-500/5 bg-[#080d18]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-500">
              Testimonials & Trust
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Dipercaya ratusan player
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-cyan-500/10 bg-[#0c1220] p-6 transition hover:border-cyan-500/25"
              >
                {/* Stars */}
                <div className="flex gap-0.5 text-cyan-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">"{t.quote}"</p>
                <div className="mt-5 border-t border-white/5 pt-4">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-cyan-500/60">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
