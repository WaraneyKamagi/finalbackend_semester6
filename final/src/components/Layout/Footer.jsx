import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-cyan-500/10 bg-[#060a13]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-wider text-white">JokiTorang</span>
              <span className="text-[10px] uppercase tracking-widest text-cyan-500/50">Pro Game Pilots</span>
            </Link>
            <p className="mt-2 text-xs text-slate-500">
              © {new Date().getFullYear()} JokiTorang. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#services" className="text-slate-500 transition hover:text-cyan-400">Services</a>
            <a href="#testimoni" className="text-slate-500 transition hover:text-cyan-400">Testimonials</a>
            <a href="mailto:admin@jokitorang.com" className="text-slate-500 transition hover:text-cyan-400">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
