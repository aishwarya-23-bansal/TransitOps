import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import Table from '../components/Table.jsx'
import { vehicles, maintenanceRecords } from '../data/dummyData.js'
import { statusColor, formatCurrency } from '../utils/helpers.js'

export default function Maintenance() {
  const { register, handleSubmit, reset } = useForm()
  const [records, setRecords] = useState(maintenanceRecords)

  const onSubmit = (data) => {
    setRecords((r) => [{ id: Date.now(), vehicle: data.vehicle, issue: data.issue, cost: Number(data.cost) || 0, status: data.status || 'Scheduled', start: data.start, end: data.end }, ...r])
    toast.success('Maintenance record saved')
    reset()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Log Maintenance" className="lg:col-span-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Dropdown label="Vehicle" options={vehicles.map((v) => v.registration)} {...register('vehicle', { required: true })} />
          <Input label="Issue" placeholder="e.g. Brake pad replacement" {...register('issue', { required: true })} />
          <Input label="Cost (₹)" type="number" placeholder="e.g. 4500" {...register('cost')} />
          <Dropdown label="Status" options={['Scheduled', 'In Progress', 'Completed']} {...register('status')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" {...register('start')} />
            <Input label="End Date" type="date" {...register('end')} />
          </div>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Card>

      <Card title="Maintenance History" className="lg:col-span-2">
        <Table
          columns={['Vehicle', 'Issue', 'Cost', 'Status', 'Start', 'End']}
          data={records}
          renderRow={(r) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{r.vehicle}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{r.issue}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{formatCurrency(r.cost)}</td>
              <td className="px-5 py-3"><Badge color={statusColor(r.status)}>{r.status}</Badge></td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{r.start}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{r.end}</td>
            </>
          )}
        />
      </Card>
    </div>
  )
}
