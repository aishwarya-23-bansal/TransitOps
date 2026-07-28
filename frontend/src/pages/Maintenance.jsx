import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import Table from '../components/Table.jsx'
import { maintenanceAPI, vehicleAPI } from '../services/api.js'
import { statusColor, formatCurrency } from '../utils/helpers.js'

export default function Maintenance() {
  const { register, handleSubmit, reset } = useForm()
  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maintRes, vehRes] = await Promise.all([
          maintenanceAPI.getAll(),
          vehicleAPI.getAll(),
        ])
        setRecords(maintRes.data.maintenance || [])
        setVehicles(vehRes.data || [])
      } catch (error) {
        toast.error('Failed to load maintenance records')
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data) => {
    try {
      const res = await maintenanceAPI.create({
        vehicle: data.vehicle,
        title: data.issue,
        description: data.issue,
        cost: Number(data.cost) || 0,
      })
      setRecords((r) => [res.data.maintenance, ...r])
      toast.success('Maintenance record saved')
      reset()
    } catch (error) {
      toast.error('Failed to save maintenance')
      console.error(error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Log Maintenance" className="lg:col-span-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Dropdown
            label="Vehicle"
            options={vehicles.map((v) => ({ value: v._id, label: v.registrationNumber }))}
            {...register('vehicle', { required: true })}
          />
          <Input label="Issue" placeholder="e.g. Brake pad replacement" {...register('issue', { required: true })} />
          <Input label="Cost (₹)" type="number" placeholder="e.g. 4500" {...register('cost')} />
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Card>
      <Card title="Maintenance History" className="lg:col-span-2">
        <Table
          columns={['Vehicle', 'Issue', 'Cost', 'Status']}
          data={records}
          renderRow={(r) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">
                {r.vehicle && r.vehicle.registrationNumber ? r.vehicle.registrationNumber : r.vehicle}
              </td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{r.title || r.description}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{formatCurrency(r.cost)}</td>
              <td className="px-5 py-3"><Badge color={statusColor(r.status)}>{r.status}</Badge></td>
            </>
          )}
        />
      </Card>
    </div>
  )
}