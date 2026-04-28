const Button = ({ children, className = '', variant = 'primary', size = 'md', disabled, onClick, type = 'button', id }) => {
  const base = 'rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95'

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-sm',
  }

  const variants = {
    primary:
      'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 focus-visible:ring-cyan-400',
    secondary:
      'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 focus-visible:ring-slate-500',
    ghost:
      'bg-transparent text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/40 focus-visible:ring-cyan-400',
  }

  return (
    <button
      id={id}
      type={type}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
