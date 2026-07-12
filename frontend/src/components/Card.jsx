export default function Card({ children, className = '', title, action }) {
  return (
    <div className={`bg-card border border-border rounded-xl2 shadow-soft p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-sm font-semibold text-gray-200">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
