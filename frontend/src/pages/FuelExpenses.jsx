import { useState, useEffect } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../components/Card.jsx'
import Search from '../components/Search.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Table from '../components/Table.jsx'
import { fuelAPI, expenseAPI, vehicleAPI } from '../services/api.js'
import { formatCurrency } from '../utils/helpers.js'

export default function FuelExpenses() {
  const [query, setQuery] = useState('')
  const [fuel, setFuel] = useState([])
  const [expenses, setExpenses] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [showFuelModal, setShowFuelModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  const fuelForm = useForm()
  const expenseForm = useForm()

  const fetchData = async () => {
    try {
      const [fuelRes, expenseRes, vehRes] = await Promise.all([
        fuelAPI.getAll(),
        expenseAPI.getAll(),
        vehicleAPI.getAll(),
      ])
      setFuel(fuelRes.data)
      setExpenses(expenseRes.data)
      setVehicles(vehRes.data)
    } catch (error) {
      toast.error('Failed to load fuel and expenses')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalFuelCost = fuel.reduce((sum, f) => sum + (f.cost || 0), 0)
  const totalExpenseCost = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)

  const onFuelSubmit = async (data) => {
    try {
      await fuelAPI.create({
        vehicleId: data.vehicleId,
        liters: Number(data.liters),
        cost: Number(data.cost),
        date: data.date || undefined,
      })
      toast.success('Fuel log added')
      fuelForm.reset()
      setShowFuelModal(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add fuel log')
      console.error(error)
    }
  }

  const onExpenseSubmit = async (data) => {
    try {
      await expenseAPI.create({
        vehicleId: data.vehicleId,
        type: data.type,
        amount: Number(data.amount),
        description: data.description || '',
        date: data.date || undefined,
      })
      toast.success('Expense added')
      expenseForm.reset()
      setShowExpenseModal(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense')
      console.error(error)
    }
  }

  const vehicleLabel = (v) => (v && v.registrationNumber ? v.registrationNumber : v)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Search value={query} onChange={setQuery} placeholder="Search by vehicle" className="sm:w-72" />
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => setShowFuelModal(true)}>
            <FiPlus size={16} /> Add Fuel
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setShowExpenseModal(true)}>
            <FiPlus size={16} /> Add Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="!p-4">
          <p className="text-xs text-gray-500 mb-1">Total Fuel Cost</p>
          <p className="text-2xl font-bold text-accent">{formatCurrency(totalFuelCost)}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalExpenseCost)}</p>
        </Card>
      </div>

      <Card title="Fuel Logs">
        <Table
          columns={['Vehicle', 'Date', 'Liters', 'Cost']}
          data={fuel.filter((f) => vehicleLabel(f.vehicleId).toLowerCase().includes(query.toLowerCase()))}
          renderRow={(f) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{vehicleLabel(f.vehicleId)}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{f.date ? f.date.split('T')[0] : ''}</td>
              <td className="px-5 py-3 text-gray-400">{f.liters} L</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{formatCurrency(f.cost)}</td>
            </>
          )}
        />
      </Card>

      <Card title="Expense Logs">
        <Table
          columns={['Vehicle', 'Category', 'Date', 'Cost']}
          data={expenses.filter((e) => vehicleLabel(e.vehicleId).toLowerCase().includes(query.toLowerCase()))}
          renderRow={(e) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{vehicleLabel(e.vehicleId)}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{e.type}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{e.date ? e.date.split('T')[0] : ''}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{formatCurrency(e.amount)}</td>
            </>
          )}
        />
      </Card>

      {showFuelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400" onClick={() => setShowFuelModal(false)}>
              <FiX size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Add Fuel Log</h3>
            <form onSubmit={fuelForm.handleSubmit(onFuelSubmit)} className="space-y-4">
              <Dropdown
                label="Vehicle"
                options={vehicles.map((v) => ({ value: v._id, label: v.registrationNumber }))}
                {...fuelForm.register('vehicleId', { required: true })}
              />
              <Input label="Liters" type="number" step="0.01" placeholder="e.g. 20" {...fuelForm.register('liters', { required: true })} />
              <Input label="Cost (₹)" type="number" placeholder="e.g. 2000" {...fuelForm.register('cost', { required: true })} />
              <Input label="Date" type="date" {...fuelForm.register('date')} />
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400" onClick={() => setShowExpenseModal(false)}>
              <FiX size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Add Expense</h3>
            <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-4">
              <Dropdown
                label="Vehicle"
                options={vehicles.map((v) => ({ value: v._id, label: v.registrationNumber }))}
                {...expenseForm.register('vehicleId', { required: true })}
              />
              <Dropdown
                label="Type"
                options={['Toll', 'Parking', 'Other']}
                {...expenseForm.register('type', { required: true })}
              />
              <Input label="Amount (₹)" type="number" placeholder="e.g. 500" {...expenseForm.register('amount', { required: true })} />
              <Input label="Description" placeholder="Optional note" {...expenseForm.register('description')} />
              <Input label="Date" type="date" {...expenseForm.register('date')} />
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}