const classNames = (...classes) => classes.filter(Boolean).join(' ')

const Input = ({
  label,
  helperText,
  error,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const wrapperClass = classNames('flex flex-col gap-2 text-sm text-slate-200', className)
  const fieldClass = classNames(
    'rounded-2xl border bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2',
    error
      ? 'border-red-500/50 focus:ring-red-500'
      : 'border-slate-800 focus:ring-indigo-500',
    inputClassName,
  )

  return (
    <label className={wrapperClass}>
      {label && <span className="font-medium text-slate-100">{label}</span>}
      <input className={fieldClass} {...props} />
      {helperText && !error && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  )
}

export default Input

