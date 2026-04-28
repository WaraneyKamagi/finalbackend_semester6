import { useNavigate } from 'react-router-dom'

const currency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const ServiceCard = ({ service }) => {
  const navigate = useNavigate()

  return (
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-cyan-500/10 bg-[#0c1220] p-6 transition hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5">
      <div>
        <div className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
          {service.eta}
        </div>
        <h3 className="mt-4 text-xl font-bold text-white">{service.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.description}</p>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-white/5 pt-5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">mulai dari</p>
          <p className="text-2xl font-black text-white">{currency(service.basePrice)}</p>
        </div>
        <button
          onClick={() => navigate(`/order/${service.id}`)}
          className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
        >
          Pesan
        </button>
      </div>
    </div>
  )
}

export default ServiceCard
