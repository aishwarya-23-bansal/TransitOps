import { useState } from 'react'
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
import { vehicles as initialVehicles } from '../data/dummyData.js'
import { statusColor, paginate } from '../utils/helpers.js'

const PER_PAGE = 5

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ registration: '', model: '', type: '', capacity: '', status: 'Active' })

  const filtered = vehicles.filter((v) =>
    [v.registration, v.model, v.type].join(' ').toLowerCase().includes(query.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paged = paginate(filtered, page, PER_PAGE)

  const handleAdd = () => {
    if (!form.registration || !form.model) {
      toast.error('Registration and model are required')
      return
    }
    setVehicles((v) => [{ id: Date.now(), ...form }, ...v])
    toast.success('Vehicle added')
    setModalOpen(false)
    setForm({ registration: '', model: '', type: '', capacity: '', status: 'Active' })
  }

  const handleDelete = (id) => {
    setVehicles((v) => v.filter((x) => x.id !== id))
    toast.success('Vehicle removed')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Search value={query} onChange={(val) => { setQuery(val); setPage(1) }} placeholder="Search by registration, model, type" className="sm:w-80" />
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2 shrink-0">
          <FiPlus size={16} /> Add Vehicle
        </Button>
      </div>

      <Card>
        <Table
          columns={['Registration', 'Model', 'Type', 'Capacity', 'Status', 'Actions']}
          data={paged}
          renderRow={(v) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{v.registration}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{v.model}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{v.type}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{v.capacity}</td>
              <td className="px-5 py-3">
                <Badge color={statusColor(v.status)}>{v.status}</Badge>
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-accent transition-colors">
                    <FiEdit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </td>
            </>
          )}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Vehicle">
        <div className="space-y-4">
          <Input label="Registration" value={form.registration} onChange={(e) => setForm((f) => ({ ...f, registration: e.target.value }))} />
          <Input label="Model" value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} />
          <Dropdown label="Type" options={['Truck', 'LCV', 'Pickup', 'Mini Truck']} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} />
          <Input label="Capacity" placeholder="e.g. 2500 kg" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} />
          <Dropdown label="Status" options={['Active', 'Idle', 'Maintenance']} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleAdd} className="flex-1">Save Vehicle</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
