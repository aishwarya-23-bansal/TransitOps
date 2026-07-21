import { useState, useEffect } from 'react'
import { FiPlus } from 'react-icons/fi'
import Card from '../components/Card.jsx'
import Search from '../components/Search.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import Table from '../components/Table.jsx'
import Pagination from '../components/Pagination.jsx'
import toast from 'react-hot-toast'
import { driverAPI } from '../services/api.js'
import { statusColor, isExpiringSoon, paginate } from '../utils/helpers.js'
import Modal from '../components/Modal.jsx'
import Input from '../components/Input.jsx'


const PER_PAGE = 5

export default function DriverManagement() {
 const [drivers, setDrivers] = useState([])
const [query, setQuery] = useState('')
const [statusFilter, setStatusFilter] = useState('')
const [page, setPage] = useState(1)

const [modalOpen, setModalOpen] = useState(false)

const [form, setForm] = useState({
  name: '',
  licenseNumber: '',
  licenseCategory: '',
  licenseExpiryDate: '',
  contactNumber: '',
  safetyScore: 100,
  status: 'Available',
})
useEffect(() => {
  const loadDrivers = async () => {
    try {
      const response = await driverAPI.getAll()

      setDrivers(
        Array.isArray(response.data)
          ? response.data
          : response.data.drivers || []
      )
    } catch (err) {
      console.error(err)
      toast.error('Failed to load drivers')
    }
  }

  loadDrivers()
}, [])

  const filtered = drivers.filter((d) => {
   const matchesQuery =
  d.name.toLowerCase().includes(query.toLowerCase()) ||
  d.licenseNumber.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = !statusFilter || d.status === statusFilter
    return matchesQuery && matchesStatus
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paged = paginate(filtered, page, PER_PAGE)
  const handleAdd = async () => {
  if (
    !form.name ||
    !form.licenseNumber ||
    !form.licenseCategory ||
    !form.licenseExpiryDate ||
    !form.contactNumber
  ) {
    toast.error('Please fill all required fields')
    return
  }

  try {
    const response = await driverAPI.create(form)

    setDrivers((prev) => [response.data, ...prev])

    toast.success('Driver added successfully')

    setModalOpen(false)

    setForm({
      name: '',
      licenseNumber: '',
      licenseCategory: '',
      licenseExpiryDate: '',
      contactNumber: '',
      safetyScore: 100,
      status: 'Available',
    })
  } catch (err) {
    console.error(err)
    toast.error(err.response?.data?.message || 'Failed to add driver')
  }
}

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
       <Button
  onClick={() => setModalOpen(true)}
  className="flex items-center gap-2 shrink-0"
>
  <FiPlus size={16} />
  Add Driver
</Button>
      </div>

      <Card>
        <Table
          columns={[
  'Driver',
  'License Number',
  'License Category',
  'Expiry',
  'Contact',
  'Safety Score',
  'Status',
]}
          data={paged}
        renderRow={(d) => {
  const expiring = isExpiringSoon(d.licenseExpiryDate)
  

  return (
    <>
      <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">
        {d.name}
      </td>

      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
        {d.licenseNumber}
      </td>

      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
        {d.licenseCategory}
      </td>

      <td
        className={`px-5 py-3 whitespace-nowrap ${
          expiring ? 'text-red-400 font-medium' : 'text-gray-400'
        }`}
      >
        {new Date(d.licenseExpiryDate).toLocaleDateString()}
      </td>

      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
        {d.contactNumber}
      </td>

      <td className="px-5 py-3 text-gray-400">
        {d.safetyScore}
      </td>

      <td className="px-5 py-3">
        <Badge color={statusColor(d.status)}>
          {d.status}
        </Badge>
      </td>
    </>
  )
}}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
      <Modal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title="Add Driver"
>
  <div className="space-y-4">

    <Input
      label="Driver Name"
      value={form.name}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          name: e.target.value,
        }))
      }
    />

    <Input
      label="License Number"
      value={form.licenseNumber}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          licenseNumber: e.target.value,
        }))
      }
    />

    <Dropdown
      label="License Category"
      options={['LMV', 'HMV']}
      value={form.licenseCategory}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          licenseCategory: e.target.value,
        }))
      }
    />

    <Input
      label="License Expiry Date"
      type="date"
      value={form.licenseExpiryDate}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          licenseExpiryDate: e.target.value,
        }))
      }
    />

    <Input
      label="Contact Number"
      value={form.contactNumber}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          contactNumber: e.target.value,
        }))
      }
    />

    <Input
      label="Safety Score"
      type="number"
      value={form.safetyScore}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          safetyScore: Number(e.target.value),
        }))
      }
    />

    <Dropdown
      label="Status"
      options={[
        'Available',
        'On Trip',
        'Off Duty',
        'Suspended',
      ]}
      value={form.status}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          status: e.target.value,
        }))
      }
    />

    <div className="flex gap-3 pt-2">
      <Button onClick={handleAdd} className="flex-1">
        Save Driver
      </Button>

      <Button
        variant="secondary"
        onClick={() => setModalOpen(false)}
        className="flex-1"
      >
        Cancel
      </Button>
    </div>

  </div>
</Modal>
    </div>
  )
}
