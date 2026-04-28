import Modal from '../ui/Modal'

const currency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)

const OrderDetail = ({ order, isOpen, onClose }) => {
  if (!order) return null

  const accountDetails = [
    { label: 'Username / ID', value: order.gameAccount?.username },
    { label: 'Password', value: order.gameAccount?.password },
    { label: 'Server', value: order.gameAccount?.server },
    { label: 'Hero yang Diminta', value: order.gameAccount?.heroName },
    {
      label: 'Poin Peak Saat Ini',
      value: order.gameAccount?.peakPoint,
    },
    {
      label: 'Target Poin Peak',
      value: order.gameAccount?.targetPeakPoint,
    },
    {
      label: 'MMR Hero Saat Ini',
      value: order.gameAccount?.mmrCurrent,
    },
    {
      label: 'Target MMR Hero',
      value: order.gameAccount?.mmrTarget,
    },
    {
      label: 'Rank Saat Ini',
      value: order.gameAccount?.currentRank,
    },
    { label: 'Target Rank', value: order.gameAccount?.targetRank },
    { label: 'Bintang Saat Ini', value: order.gameAccount?.currentStar },
    { label: 'Target Bintang', value: order.gameAccount?.targetStar },
  ].filter((field) => field.value || field.value === 0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Order #${order.id}`}
      actions={
        <button
          className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          onClick={onClose}
        >
          Tutup
        </button>
      }
    >
      <div className="space-y-4 text-sm">
        <section>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Layanan
          </p>
          <p className="text-lg font-semibold text-white">
            {order.service?.name || order.serviceName}
          </p>
          <p className="text-slate-400">{order.service?.description}</p>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Akun Game
          </p>
          {accountDetails.length > 0 ? (
            <ul className="mt-2 space-y-1 text-slate-300">
              {accountDetails.map((field) => (
                <li key={field.label}>
                  {field.label}:{' '}
                  <span className="text-white">{field.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-slate-400">Belum ada detail akun.</p>
          )}
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Target
          </p>
          <p className="mt-1 text-white">{order.target}</p>
          <p className="text-slate-400">
            Paket: {order.tier?.toUpperCase() || 'Standard'}
          </p>
        </section>

        {order.notes && (
          <section>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Catatan
            </p>
            <p className="mt-1 text-slate-200">{order.notes}</p>
          </section>
        )}

        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Total Harga
          </p>
          <p className="text-2xl font-semibold text-white">
            {currency(order.totalPrice)}
          </p>
          <p className="text-xs text-slate-500">
            Status: {order.status} - Metode: {order.paymentMethod || '-'}
          </p>
        </section>
      </div>
    </Modal>
  )
}

export default OrderDetail

