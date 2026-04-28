const Button = ({ children, className = '', variant = 'primary', disabled, onClick, type = 'button' }) => {
  let baseClass = 'rounded-2xl px-4 py-2 font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50'

  let variantClass = ''
  if (variant === 'primary') {
    variantClass = 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-400'
  } else if (variant === 'secondary') {
    variantClass = 'bg-slate-800 text-white hover:bg-slate-700 focus-visible:ring-slate-500'
  } else if (variant === 'ghost') {
    variantClass = 'bg-transparent text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500 focus-visible:ring-indigo-400'
  }

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button

