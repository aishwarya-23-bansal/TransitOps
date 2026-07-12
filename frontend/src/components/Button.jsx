const variants = {
  primary: 'bg-accent hover:bg-accent-light text-white shadow-soft',
  secondary: 'bg-card hover:bg-border text-gray-200 border border-border',
  danger: 'bg-red-600/90 hover:bg-red-600 text-white',
  ghost: 'bg-transparent hover:bg-white/5 text-gray-300',
}

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
