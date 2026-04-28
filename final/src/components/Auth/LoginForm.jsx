import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

const LoginForm = ({ redirectTo = '/' }) => {
  const { login, authError, isSubmitting } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    const errors = {}
    if (!formData.email) errors.email = 'Email wajib diisi'
    if (!formData.password) errors.password = 'Password wajib diisi'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
    setFieldErrors((prev) => ({ ...prev, [event.target.name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMessage('')
    if (!validate()) return

    try {
      await login(formData)
      setSuccessMessage('Login berhasil! Mengarahkan...')
      setTimeout(() => navigate(redirectTo), 800)
    } catch {
      // error handled by context
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@email.com"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="********"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        required
      />

      {authError && (
        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          {authError}
        </p>
      )}
      {successMessage && (
        <p className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {successMessage}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sedang login...' : 'Masuk'}
      </Button>
    </form>
  )
}

export default LoginForm

