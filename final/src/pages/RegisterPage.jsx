import { Link, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import RegisterForm from '../components/Auth/RegisterForm'

const RegisterPage = () => {
  const location = useLocation()
  const redirectPath = location.state?.from || '/'

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">
          buat akun baru
        </p>
        <h1 className="text-3xl font-bold text-white">Gabung bersama pilot pro</h1>
        <p className="text-sm text-slate-400">
          Pantau progres order dan akses promo eksklusif member.
        </p>
      </div>

      <Card className="space-y-6">
        <RegisterForm redirectTo={redirectPath} />
        <p className="text-center text-sm text-slate-300">
          Sudah punya akun?{' '}
          <Link className="font-semibold text-indigo-300" to="/login">
            Masuk
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default RegisterPage

