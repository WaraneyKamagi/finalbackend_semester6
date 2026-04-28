const Input = ({ label, name, type = 'text', value, onChange, placeholder, ...props }) => {
  return (
    <label className="flex flex-col gap-2 text-sm">
      {label && <span className="font-medium text-slate-300">{label}</span>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-xl border border-cyan-500/10 bg-[#0a0f1e] px-4 py-3 text-white placeholder-slate-500 transition focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        {...props}
      />
    </label>
  )
}

export default Input
