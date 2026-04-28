import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

const RegisterForm = ({ redirectTo = '/' }) => {
  const { register, authError, isSubmitting } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    const errors = {}
    if (!formData.name) errors.name = 'Nama wajib diisi'
    if (!formData.email) errors.email = 'Email wajib diisi'
    if (formData.password.length < 6)
      errors.password = 'Minimal 6 karakter'
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password tidak cocok'
    }
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      setSuccessMessage('Registrasi berhasil! Mengarahkan...')
      setTimeout(() => navigate(redirectTo), 800)
    } catch {
      // context handles error message
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <Input
        label="Nama Lengkap"
        name="name"
        placeholder="e.g. Ranger Eko"
        value={formData.name}
        onChange={handleChange}
        error={fieldErrors.name}
        required
      />
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
        placeholder="Minimal 6 karakter"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        required
      />
      <Input
        label="Konfirmasi Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={fieldErrors.confirmPassword}
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
        {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
      </Button>
    </form>
  )
}

export default RegisterForm

