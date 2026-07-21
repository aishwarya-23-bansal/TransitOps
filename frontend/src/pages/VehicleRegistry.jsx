import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Card from '../components/Card.jsx'
import Search from '../components/Search.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import Table from '../components/Table.jsx'
import Pagination from '../components/Pagination.jsx'
import Modal from '../components/Modal.jsx'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'

import { statusColor, paginate } from '../utils/helpers.js'
import { vehicleAPI } from '../services/api.js'

const PER_PAGE = 5

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
  registrationNumber: '',
  name: '',
  type: '',
  maxLoadCapacity: '',
  odometer: '',
  acquisitionCost: '',
  region: '',
})
useEffect(() => {
  const loadVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll()

      setVehicles(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error(error)
      toast.error('Failed to load vehicles')
    }
  }

  loadVehicles()
}, [])
const filtered = vehicles.filter((v) =>
  [
    v.registrationNumber || '',
    v.name || '',
    v.type || '',
  ]
    .join(' ')
    .toLowerCase()
    .includes(query.toLowerCase())
)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paged = paginate(filtered, page, PER_PAGE)

const handleAdd = async () => {
   if (
    !form.registrationNumber ||
    !form.name ||
    !form.type ||
    !form.maxLoadCapacity ||
    !form.acquisitionCost
  ) {
    toast.error('Please fill all required fields')
    return
  }
  try {
    const response = await vehicleAPI.create(form)

    setVehicles((prev) => [response.data, ...prev])

    toast.success('Vehicle added successfully')

    setModalOpen(false)

    setForm({
      registrationNumber: '',
      name: '',
      type: '',
      maxLoadCapacity: '',
      odometer: '',
      acquisitionCost: '',
      region: '',
    })
  } catch (err) {
    console.error(err)

    toast.error(
      err.response?.data?.message || 'Failed to add vehicle'
    )
  }
}

  const handleDelete = async (id) => {
    try {
      await vehicleAPI.remove(id)
      setVehicles((v) => v.filter((x) => x._id !== id))
      toast.success('Vehicle removed')
    } catch (err) {
      console.error(err)
      toast.error('Failed to remove vehicle')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Search value={query} onChange={(val) => { setQuery(val); setPage(1) }} placeholder="Search by registration number, vehicle name or type" className="sm:w-80" />
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2 shrink-0">
          <FiPlus size={16} /> Add Vehicle
        </Button>
      </div>

      <Card>
        <Table
          columns={[
  'Registration',
  'Name',
  'Type',
  'Load Capacity',
 'Status',
  'Actions'
]}
          data={paged}
          renderRow={(v) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{v.registrationNumber}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{v.name}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{v.type}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{v.maxLoadCapacity}</td>
              <td className="px-5 py-3">
                <Badge color={statusColor(v.status)}>{v.status}</Badge>
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-accent transition-colors">
                    <FiEdit2 size={15} />
                  </button>
                 <button
  onClick={() => handleDelete(v._id)}
  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors"
>
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </td>
            </>
          )}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>

     <Modal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title="Add Vehicle"
>
  <div className="space-y-4">

    <Input
      label="Registration Number"
      value={form.registrationNumber}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          registrationNumber: e.target.value,
        }))
      }
    />

    <Input
      label="Vehicle Name"
      value={form.name}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          name: e.target.value,
        }))
      }
    />

    <Dropdown
      label="Type"
      options={['Truck', 'Van', 'Mini Truck', 'Pickup']}
      value={form.type}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          type: e.target.value,
        }))
      }
    />

    <Input
      label="Maximum Load Capacity (kg)"
      type="number"
      value={form.maxLoadCapacity}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          maxLoadCapacity: e.target.value,
        }))
      }
    />

    <Input
      label="Odometer"
      type="number"
      value={form.odometer}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          odometer: e.target.value,
        }))
      }
    />

    <Input
      label="Acquisition Cost"
      type="number"
      value={form.acquisitionCost}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          acquisitionCost: e.target.value,
        }))
      }
    />

    <Input
      label="Region"
      value={form.region}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          region: e.target.value,
        }))
      }
    />

    <div className="flex gap-3 pt-2">
      <Button onClick={handleAdd} className="flex-1">
        Save Vehicle
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