import { Link, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import LoginForm from '../components/Auth/LoginForm'

const LoginPage = () => {
  const location = useLocation()
  const redirectPath = location.state?.from || '/'

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-500">
          selamat datang kembali
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Masuk ke dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Lanjutkan pesanan atau cek progres order Anda.
        </p>
      </div>

      <Card className="space-y-6">
        <LoginForm redirectTo={redirectPath} />
        <p className="text-center text-sm text-slate-400">
          Belum punya akun?{' '}
          <Link className="font-semibold text-cyan-400 hover:text-cyan-300" to="/register">
            Daftar sekarang
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginPage
