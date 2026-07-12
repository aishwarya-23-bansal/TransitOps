import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import Card from '../components/Card.jsx'
import Search from '../components/Search.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import Table from '../components/Table.jsx'
import Pagination from '../components/Pagination.jsx'
import { drivers } from '../data/dummyData.js'
import { statusColor, isExpiringSoon, paginate } from '../utils/helpers.js'

const PER_PAGE = 5

export default function DriverManagement() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const filtered = drivers.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase()) || d.license.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = !statusFilter || d.status === statusFilter
    return matchesQuery && matchesStatus
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paged = paginate(filtered, page, PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <Search value={query} onChange={(v) => { setQuery(v); setPage(1) }} placeholder="Search by name or license" className="sm:w-72" />
          <Dropdown
            className="sm:w-44"
            placeholder="Filter Status"
            options={['On Duty', 'Off Duty', 'Suspended']}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          />
        </div>
        <Button className="flex items-center gap-2 shrink-0">
          <FiPlus size={16} /> Add Driver
        </Button>
      </div>

      <Card>
        <Table
          columns={['Driver', 'License Number', 'Expiry', 'Contact', 'Safety Score', 'Status']}
          data={paged}
          renderRow={(d) => {
            const expiring = isExpiringSoon(d.expiry)
            return (
              <>
                <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{d.name}</td>
                <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{d.license}</td>
                <td className={`px-5 py-3 whitespace-nowrap ${expiring ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                  {d.expiry} {expiring && <span className="text-xs">(expiring soon)</span>}
                </td>
                <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{d.contact}</td>
                <td className="px-5 py-3 text-gray-400">{d.safetyScore}</td>
                <td className="px-5 py-3">
                  <Badge color={statusColor(d.status)}>{d.status}</Badge>
                </td>
              </>
            )
          }}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
    </div>
  )
}
