import { forwardRef } from 'react'

const Dropdown = forwardRef(({ label, options = [], placeholder = 'Select', className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={`w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  )
})

export default Dropdown
