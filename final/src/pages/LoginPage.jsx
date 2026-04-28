import { Link, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import LoginForm from '../components/Auth/LoginForm'

const LoginPage = () => {
  const location = useLocation()
  const redirectPath = location.state?.from || '/'

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
          selamat datang kembali
        </p>
        <h1 className="text-3xl font-bold text-white">Masuk ke dashboard</h1>
        <p className="text-sm text-slate-400">
          Lanjutkan pesanan atau cek progres order Anda.
        </p>
      </div>

      <Card className="space-y-6">
        <LoginForm redirectTo={redirectPath} />
        <p className="text-center text-sm text-slate-300">
          Belum punya akun?{' '}
          <Link className="font-semibold text-indigo-300" to="/register">
            Daftar sekarang
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginPage

