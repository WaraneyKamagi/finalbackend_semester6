const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-cyan-500/10 bg-[#0c1220] p-6 text-slate-200 shadow-lg shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
