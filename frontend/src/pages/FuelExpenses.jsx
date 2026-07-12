import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Card from '../components/Card.jsx'
import Search from '../components/Search.jsx'
import Button from '../components/Button.jsx'
import Table from '../components/Table.jsx'
import { fuelLogs, expenseLogs } from '../data/dummyData.js'
import { formatCurrency } from '../utils/helpers.js'

export default function FuelExpenses() {
  const [query, setQuery] = useState('')
  const [fuel] = useState(fuelLogs)
  const [expenses] = useState(expenseLogs)

  const totalFuelCost = fuel.reduce((sum, f) => sum + f.cost, 0)
  const totalExpenseCost = expenses.reduce((sum, e) => sum + e.cost, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Search value={query} onChange={setQuery} placeholder="Search by vehicle" className="sm:w-72" />
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => toast.success('Fuel log added')}>
            <FiPlus size={16} /> Add Fuel
          </Button>
          <Button className="flex items-center gap-2" onClick={() => toast.success('Expense added')}>
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
          data={fuel.filter((f) => f.vehicle.toLowerCase().includes(query.toLowerCase()))}
          renderRow={(f) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{f.vehicle}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{f.date}</td>
              <td className="px-5 py-3 text-gray-400">{f.liters} L</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{formatCurrency(f.cost)}</td>
            </>
          )}
        />
      </Card>

      <Card title="Expense Logs">
        <Table
          columns={['Vehicle', 'Category', 'Date', 'Cost']}
          data={expenses.filter((e) => e.vehicle.toLowerCase().includes(query.toLowerCase()))}
          renderRow={(e) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{e.vehicle}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{e.category}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{e.date}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{formatCurrency(e.cost)}</td>
            </>
          )}
        />
      </Card>
    </div>
  )
}
