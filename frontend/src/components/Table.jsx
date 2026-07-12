import EmptyState from './EmptyState.jsx'

export default function Table({ columns, data, renderRow }) {
  if (!data || data.length === 0) {
    return <EmptyState message="No records found" />
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border text-left">
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-border/60 hover:bg-white/[0.03] transition-colors">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
