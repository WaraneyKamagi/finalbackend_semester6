import { useMemo, useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useAuth } from '../../context/AuthContext'
import { createOrder } from '../../utils/api'

const tierOptions = [
  { value: 'standard', label: 'Standard', multiplier: 1 },
  { value: 'priority', label: 'Priority (lebih cepat)', multiplier: 1.25 },
  { value: 'express', label: 'Express 24 Jam', multiplier: 1.5 },
]

const rankOptions = [
  { value: 'grandmaster', label: 'Grandmaster' },
  { value: 'mitik', label: 'Mitik' },
  { value: 'epic', label: 'Epic' },
  { value: 'legend', label: 'Legend' },
]

const rankOrder = rankOptions.map((item) => item.value)
const sameRankStarRates = {
  grandmaster: 5000,
  mitik: 7000,
  epic: 10000,
  legend: 10000,
}
const rankStages = [
  { rank: 'grandmaster', start: 0, rate: sameRankStarRates.grandmaster },
  { rank: 'mitik', start: 25, rate: sameRankStarRates.mitik },
  { rank: 'epic', start: 50, rate: sameRankStarRates.epic },
  { rank: 'legend', start: 100, rate: sameRankStarRates.legend },
]
const starDefaults = {
  grandmaster: '0',
  mitik: '25',
  epic: '50',
  legend: '100',
}

const detectServiceType = (serviceName = '') => {
  const normalized = serviceName.toLowerCase()
  if (normalized.includes('mmr')) return 'mmr'
  if (normalized.includes('peak')) return 'peak'
  if (normalized.includes('rank')) return 'rank'
  return 'general'
}

const deriveRankFromStar = (starValue) => {
  const star = Number(starValue)
  if (Number.isNaN(star)) return null
  if (star >= 100) return 'legend'
  if (star >= 50) return 'epic'
  if (star >= 25) return 'mitik'
  return 'grandmaster'
}

const getStageByRank = (rank) =>
  rankStages.find((stage) => stage.rank === rank) || rankStages[0]

const toAbsoluteStar = (rank, starValue) => {
  const stage = getStageByRank(rank)
  const numeric = Number(starValue)
  if (Number.isNaN(numeric)) {
    return stage.start
  }
  return Math.max(numeric, stage.start)
}

const getStageIndexByStar = (star) => {
  for (let i = rankStages.length - 1; i >= 0; i -= 1) {
    if (star >= rankStages[i].start) {
      return i
    }
  }
  return 0
}

const calculateRankSurcharge = (currentRank, currentStar, targetRank, targetStar) => {
  const start = toAbsoluteStar(currentRank, currentStar)
  const end = toAbsoluteStar(targetRank, targetStar)
  if (end <= start) {
    return 0
  }

  let cost = 0
  let pointer = start

  while (pointer < end) {
    const stageIndex = getStageIndexByStar(pointer)
    const stage = rankStages[stageIndex]
    const nextBoundary = rankStages[stageIndex + 1]?.start ?? Infinity
    const segmentEnd = Math.min(end, nextBoundary)
    cost += (segmentEnd - pointer) * stage.rate
    pointer = segmentEnd
  }

  return cost
}

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const getRankLabel = (value) =>
  rankOptions.find((option) => option.value === value)?.label || value

const OrderForm = ({ service, onSuccess }) => {
  const { user } = useAuth()
  const serviceType = useMemo(
    () => detectServiceType(service?.name),
    [service?.name],
  )
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    peakCurrent: '',
    peakTarget: '',
    mmrCurrent: '',
    mmrTarget: '',
    heroName: '',
    rankCurrent: rankOrder[0],
    rankTarget: rankOrder[1] || rankOrder[0],
    rankCurrentStar: starDefaults[rankOrder[0]] || '',
    rankTargetStar: starDefaults[rankOrder[1]] || '',
    notes: '',
  })
  const [selectedTier, setSelectedTier] = useState(tierOptions[0].value)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const selectedTierData =
    tierOptions.find((option) => option.value === selectedTier) ||
    tierOptions[0]

  const numericDiff = (currentValue, targetValue) => {
    const current = Number(currentValue) || 0
    const target = Number(targetValue) || 0
    return Math.max(target - current, 0)
  }

  const serviceSurcharge = useMemo(() => {
    if (serviceType === 'peak') {
      const diff = numericDiff(formData.peakCurrent, formData.peakTarget)
      return Math.ceil(diff / 100) * 50000
    }
    if (serviceType === 'mmr') {
      const diff = numericDiff(formData.mmrCurrent, formData.mmrTarget)
      return Math.ceil(diff / 100) * 30000
    }
    if (serviceType === 'rank') {
      return calculateRankSurcharge(
        formData.rankCurrent,
        formData.rankCurrentStar,
        formData.rankTarget,
        formData.rankTargetStar,
      )
    }
    return 0
  }, [
    formData.mmrCurrent,
    formData.mmrTarget,
    formData.peakCurrent,
    formData.peakTarget,
    formData.rankCurrent,
    formData.rankTarget,
    formData.rankCurrentStar,
    formData.rankTargetStar,
    serviceType,
  ])

  const calculatedPrice = useMemo(() => {
    const base = Number(service.basePrice) || 0
    let subtotal = base + serviceSurcharge

    return Math.max(
      Math.round(subtotal * (selectedTierData.multiplier || 1)),
      base,
    )
  }, [
    selectedTierData.multiplier,
    service.basePrice,
    serviceSurcharge,
  ])

  const validate = () => {
    const newErrors = {}
    if (!formData.username) newErrors.username = 'Username wajib diisi'
    if (!formData.password) newErrors.password = 'Password wajib diisi'

    if (serviceType === 'peak') {
      if (!formData.peakCurrent)
        newErrors.peakCurrent = 'Poin peak saat ini wajib diisi'
      if (!formData.peakTarget)
        newErrors.peakTarget = 'Target poin peak wajib diisi'
      if (numericDiff(formData.peakCurrent, formData.peakTarget) <= 0) {
        newErrors.peakTarget = 'Target harus di atas poin sekarang'
      }
    }

    if (serviceType === 'mmr') {
      if (!formData.heroName) newErrors.heroName = 'Nama hero wajib diisi'
      if (!formData.mmrCurrent)
        newErrors.mmrCurrent = 'MMR saat ini wajib diisi'
      if (!formData.mmrTarget)
        newErrors.mmrTarget = 'Target MMR wajib diisi'
      if (numericDiff(formData.mmrCurrent, formData.mmrTarget) <= 0) {
        newErrors.mmrTarget = 'Target harus di atas MMR sekarang'
      }
    }

    if (serviceType === 'rank') {
      const currentAbsolute = toAbsoluteStar(
        formData.rankCurrent,
        formData.rankCurrentStar,
      )
      const targetAbsolute = toAbsoluteStar(
        formData.rankTarget,
        formData.rankTargetStar,
      )
      if (targetAbsolute <= currentAbsolute) {
        newErrors.rankTarget = 'Target rank/bintang harus lebih tinggi'
      }
      if (!formData.rankCurrentStar) {
        newErrors.rankCurrentStar = 'Bintang saat ini wajib diisi'
      }
      if (!formData.rankTargetStar) {
        newErrors.rankTargetStar = 'Target bintang wajib diisi'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => {
      const next = { ...prev }

      if (name === 'rankCurrent' || name === 'rankTarget') {
        next[name] = value
        const defaultStar = starDefaults[value]
        if (defaultStar !== undefined) {
          const starField =
            name === 'rankCurrent' ? 'rankCurrentStar' : 'rankTargetStar'
          next[starField] = defaultStar
        }
      } else if (name === 'rankCurrentStar' || name === 'rankTargetStar') {
        const derivedRank = deriveRankFromStar(value)
        if (name === 'rankCurrentStar') {
          next.rankCurrentStar = value
          if (derivedRank) {
            next.rankCurrent = derivedRank
          }
        } else {
          next.rankTargetStar = value
          if (derivedRank) {
            next.rankTarget = derivedRank
          }
        }
      } else {
        next[name] = value
      }

      return next
    })

    setErrors((prev) => ({
      ...prev,
      [name]: '',
      ...(name === 'rankCurrent' && { rankCurrentStar: '' }),
      ...(name === 'rankTarget' && { rankTargetStar: '' }),
    }))
  }

  const buildOrderFields = () => {
    if (serviceType === 'peak') {
      return {
        gameAccount: {
          username: formData.username,
          password: formData.password,
          peakPoint: Number(formData.peakCurrent),
          targetPeakPoint: Number(formData.peakTarget),
        },
        target: `Peak ${formData.peakTarget}`,
      }
    }
    if (serviceType === 'mmr') {
      return {
        gameAccount: {
          username: formData.username,
          password: formData.password,
          heroName: formData.heroName,
          mmrCurrent: Number(formData.mmrCurrent),
          mmrTarget: Number(formData.mmrTarget),
        },
        target: `MMR ${formData.mmrTarget}`,
      }
    }
    if (serviceType === 'rank') {
      return {
        gameAccount: {
          username: formData.username,
          password: formData.password,
          currentRank: getRankLabel(formData.rankCurrent),
          targetRank: getRankLabel(formData.rankTarget),
          currentStar: Number(formData.rankCurrentStar),
          targetStar: Number(formData.rankTargetStar),
        },
        target: `Rank ${getRankLabel(formData.rankTarget)} (Bintang ${formData.rankTargetStar})`,
      }
    }
    return {
      gameAccount: {
        username: formData.username,
        password: formData.password,
      },
      target: '',
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback('')
    if (!validate() || !user) return

    setLoading(true)
    try {
      const { gameAccount, target } = buildOrderFields()
      const orderPayload = {
        userId: user.id,
        serviceId: service.id,
        serviceName: service.name,
        gameAccount,
        target,
        tier: selectedTier,
        notes: formData.notes,
        totalPrice: calculatedPrice,
      }

      const order = await createOrder(orderPayload)
      setFeedback('Order berhasil dibuat! Mengarahkan ke pembayaran...')
      setTimeout(() => {
        onSuccess?.(order)
      }, 700)
    } catch (error) {
      setFeedback(error.message || 'Gagal membuat order')
    } finally {
      setLoading(false)
    }
  }

  const renderServiceSpecificFields = () => {
    if (serviceType === 'peak') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Username / ID Login"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />
          <Input
            label="Password Akun"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Input
            label="Poin Peak Saat Ini"
            name="peakCurrent"
            type="number"
            min={0}
            value={formData.peakCurrent}
            onChange={handleChange}
            error={errors.peakCurrent}
            required
          />
          <Input
            label="Target Poin Peak"
            name="peakTarget"
            type="number"
            min={0}
            value={formData.peakTarget}
            onChange={handleChange}
            error={errors.peakTarget}
            required
          />
        </div>
      )
    }

    if (serviceType === 'mmr') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Username / ID Login"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />
          <Input
            label="Password Akun"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Input
            label="Hero yang Direquest"
            name="heroName"
            value={formData.heroName}
            onChange={handleChange}
            error={errors.heroName}
            required
            placeholder="Contoh: Mayene"
          />
          <Input
            label="MMR Hero Saat Ini"
            name="mmrCurrent"
            type="number"
            min={0}
            value={formData.mmrCurrent}
            onChange={handleChange}
            error={errors.mmrCurrent}
            required
          />
          <Input
            label="Target MMR Hero"
            name="mmrTarget"
            type="number"
            min={0}
            value={formData.mmrTarget}
            onChange={handleChange}
            error={errors.mmrTarget}
            required
          />
        </div>
      )
    }

    if (serviceType === 'rank') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Username / ID Login"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />
          <Input
            label="Password Akun"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            <span className="font-medium text-slate-100">
              Rank Saat Ini <span className="text-red-400">*</span>
            </span>
            <select
              name="rankCurrent"
              value={formData.rankCurrent}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {rankOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            <span className="font-medium text-slate-100">
              Target Rank <span className="text-red-400">*</span>
            </span>
            <select
              name="rankTarget"
              value={formData.rankTarget}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {rankOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.rankTarget && (
              <span className="text-xs text-red-400">{errors.rankTarget}</span>
            )}
          </label>
          <Input
            label="Bintang Saat Ini"
            name="rankCurrentStar"
            type="number"
            min={0}
            value={formData.rankCurrentStar}
            onChange={handleChange}
            error={errors.rankCurrentStar}
            required
          />
          <Input
            label="Target Bintang"
            name="rankTargetStar"
            type="number"
            min={0}
            value={formData.rankTargetStar}
            onChange={handleChange}
            error={errors.rankTargetStar}
            required
          />
        </div>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Username / ID Login"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
        <Input
          label="Password Akun"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Detail Akun Game</h3>
        {renderServiceSpecificFields()}
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium text-slate-100">Catatan Tambahan</span>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Hero favorit, jam online, atau detail lain"
          />
        </label>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Paket Eksekusi</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {tierOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setSelectedTier(option.value)}
              className={[
                'rounded-2xl border px-4 py-3 text-left transition',
                selectedTier === option.value
                  ? 'border-indigo-500 bg-indigo-500/10 text-white'
                  : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700',
              ].join(' ')}
            >
              <p className="text-sm font-semibold uppercase tracking-wide">
                {option.label}
              </p>
              <p className="text-xs text-slate-400">
                Multiplier x{option.multiplier}
              </p>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-slate-200">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Estimasi Harga
          </p>
          <p className="text-4xl font-bold text-white">
            {formatCurrency(calculatedPrice)}
          </p>
          <p className="text-xs text-slate-400">
            Harga naik otomatis mengikuti target poin/MMR/rank + paket eksekusi.
          </p>
        </div>
      </Card>

      {feedback && (
        <Card
          className={`text-sm ${feedback.includes('berhasil') ? 'text-emerald-200' : 'text-red-200'
            }`}
        >
          {feedback}
        </Card>
      )}

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? 'Membuat Order...' : 'Lanjut ke Pembayaran'}
      </Button>
    </form>
  )
}

export default OrderForm

