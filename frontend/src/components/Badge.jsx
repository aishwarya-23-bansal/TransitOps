const colorMap = {
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  gray: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
}

export default function Badge({ children, color = 'gray' }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${colorMap[color]}`}>
      {children}
    </span>
  )
}
