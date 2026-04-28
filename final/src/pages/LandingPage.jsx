import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ServiceList from '../components/Services/ServiceList'
import { fetchServices } from '../utils/api'
import hokLogo from '../assets/Mayene-Honor-of-Kings.webp'
import { useAuth } from '../context/AuthContext'

const testimonials = [
  {
    name: 'Fajar - Pro Player',
    quote:
      'Order push Mythic 50 star selesai dalam 3 hari, komunikasi tim super responsif!',
    rating: 5,
  },
  {
    name: 'Intan - Content Creator',
    quote:
      'Pilotnya rapi, akun aman, dan ada update progres tiap hari. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Rendy - Student',
    quote:
      'Harga sesuai kualitas. Bisa request hero favorit, hasilnya memuaskan!',
    rating: 5,
  },
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
    <div className="flex flex-1 flex-col gap-16 bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 pb-16 pt-10">
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
              Honor of Kings Boosting Service
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              Jasa joki Honor of Kings dengan pilot top-tier.
            </h1>
            <p className="text-lg text-slate-300">
              Tim spesialis HoK siap push Glory King, tingkatkan Power, dan
              menjaga akunmu tetap aman dengan update progres real-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/services')} size="lg">
                Pesan Joki HoK
              </Button>
              {!isAuthenticated && (
                <Button onClick={() => navigate('/login')} variant="ghost" size="lg">
                  Masuk Dashboard
                </Button>
              )}
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                Order selesai
              </div>
              <div>
                <p className="text-3xl font-bold text-white">4.9/5</p>
                Rating pelanggan
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                Live support
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-indigo-500/30 bg-linear-to-br from-indigo-600/10 to-slate-950/60 p-8 shadow-2xl shadow-indigo-500/20">
            <div className="absolute inset-4 rounded-4xl bg-linear-to-br from-indigo-500/20 to-purple-500/10 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 text-white">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-64 w-64 rounded-full border border-indigo-500/40 animate-ping opacity-60" />
                <div className="h-64 w-64 rounded-4xl bg-linear-to-br from-indigo-600/40 to-violet-700/30 p-6 shadow-inner shadow-black/40 backdrop-blur">
                  <img
                    src={hokLogo}
                    alt="Honor of Kings neon crest"
                    className="h-full w-full object-contain drop-shadow-[0_0_25px_rgba(99,102,241,0.7)]"
                  />
                </div>
              </div>
              <div className="space-y-4 text-center">
                <p className="text-sm uppercase tracking-[0.4em] text-indigo-200">
                  Honor of Kings Focus
                </p>
                <h3 className="text-2xl font-bold">
                  Monitoring order HoK langsung dari dashboard.
                </h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li>- Update Glory / King Star setiap sesi push</li>
                  <li>- Notifikasi status via email & WhatsApp</li>
                  <li>- Pilot profesional server Garena & China client</li>
                </ul>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
                    Slot Honor of Kings Berikut
                  </p>
                  <p className="text-4xl font-black text-white">02:30 WIB</p>
                  <p className="text-slate-300">
                    Booking HoK sekarang, seat pilot terbatas!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto flex max-w-6xl flex-col gap-6 px-4"
      >
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
            Layanan HoK Unggulan
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Pilih paket push Honor of Kings sesuai kebutuhanmu
          </h2>
          <p className="text-slate-400">
            Fokus pada Glory Rank, Power Score, dan hero favorit HoK dengan
            pilot profesional.
          </p>
        </div>
        <ServiceList services={services} loading={loading} error={error} />
      </section>

      <section
        id="testimoni"
        className="mx-auto flex max-w-6xl flex-col gap-6 px-4"
      >
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
            testimoni honor of kings
          </p>
          <h2 className="text-3xl font-bold text-white">
            Testimoni Player HoK
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-yellow-200">
                  Rating
                </p>
                <p className="text-2xl font-bold text-yellow-300">
                  {item.rating.toFixed(1)} / 5
                </p>
              </div>
              <p className="text-base text-slate-200">"{item.quote}"</p>
              <p className="text-sm font-semibold text-white">{item.name}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default LandingPage

