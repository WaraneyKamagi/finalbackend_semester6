import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../utils/api'

const STORAGE_KEY = 'jj_auth_user'
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setInitializing(false)
  }, [])

  const persistUser = (data) => {
    setUser(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const login = async (credentials) => {
    setIsSubmitting(true)
    setAuthError(null)
    try {
      const authenticatedUser = await loginUser(credentials)
      persistUser(authenticatedUser)
      return authenticatedUser
    } catch (error) {
      setAuthError(error.message || 'Gagal login')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const register = async (payload) => {
    setIsSubmitting(true)
    setAuthError(null)
    try {
      const newUser = await registerUser(payload)
      persistUser(newUser)
      return newUser
    } catch (error) {
      setAuthError(error.message || 'Gagal registrasi')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    initializing,
    isSubmitting,
    authError,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }
  return context
}

