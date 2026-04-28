const baseClass =
  'rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-slate-200 shadow-lg shadow-slate-950/30 backdrop-blur'

const classNames = (...classes) => classes.filter(Boolean).join(' ')

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={classNames(baseClass, className)} {...props}>
      {children}
    </div>
  )
}

export default Card

