import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ message = 'Nothing here yet' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <FiInbox size={32} className="mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
