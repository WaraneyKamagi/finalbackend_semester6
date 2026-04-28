const Footer = () => {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p>Copyright {new Date().getFullYear()} JokiTorang. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#services" className="transition hover:text-white">
            Our Services
          </a>
          <a href="#testimoni" className="transition hover:text-white">
            Testimoni
          </a>
          <a href="mailto:admin@JokiTorang.com" className="transition hover:text-white">
            Support
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

