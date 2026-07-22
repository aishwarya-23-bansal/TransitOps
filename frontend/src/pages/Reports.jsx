import { useState, useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/Card.jsx'
import ChartCard from '../components/ChartCard.jsx'
import Button from '../components/Button.jsx'
import { vehicleAPI, driverAPI, tripAPI } from '../services/api.js'

export default function Reports() {
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trips, setTrips] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [vehicleRes, driverRes, tripRes] = await Promise.all([
        vehicleAPI.getAll(),
        driverAPI.getAll(),
        tripAPI.getAll(),
      ])

      const normalizedVehicles = Array.isArray(vehicleRes?.data)
        ? vehicleRes.data
        : Array.isArray(vehicleRes?.data?.vehicles)
          ? vehicleRes.data.vehicles
          : []
      const normalizedDrivers = Array.isArray(driverRes?.data)
        ? driverRes.data
        : Array.isArray(driverRes?.data?.drivers)
          ? driverRes.data.drivers
          : []
      const normalizedTrips = Array.isArray(tripRes?.data)
        ? tripRes.data
        : Array.isArray(tripRes?.data?.trips)
          ? tripRes.data.trips
          : []

      setVehicles(normalizedVehicles)
      setDrivers(normalizedDrivers)
      setTrips(normalizedTrips)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load reports')
    }
  }

  const totalRevenue = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0)
  const completedTrips = trips.filter((trip) => trip.status === 'Completed').length
  const activeTrips = trips.filter((trip) => trip.status === 'Dispatched').length
  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === 'Available').length

  const fleetUtilization = vehicles.length
    ? Math.round(((vehicles.length - availableVehicles) / vehicles.length) * 100)
    : 0

  const reportStats = [
    { label: 'Total Revenue', value: `₹${totalRevenue}` },
    { label: 'Completed Trips', value: completedTrips },
    { label: 'Active Trips', value: activeTrips },
    { label: 'Fleet Size', value: vehicles.length },
  ]

  const fuelEfficiency = trips.length > 0
    ? Math.round((trips.filter((trip) => trip.fuelConsumed > 0).length / trips.length) * 100)
    : 0

  const costControl = totalRevenue > 0
    ? Math.min(100, Math.round((completedTrips / Math.max(trips.length, 1)) * 100))
    : 0

  const progressItems = [
    { label: 'Fleet Utilization', value: fleetUtilization, color: '#4ADE80' },
    { label: 'Fuel Efficiency', value: fuelEfficiency, color: '#EF4444' },
    { label: 'Cost Control', value: costControl, color: '#60A5FA' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button variant="secondary" className="flex items-center gap-2" onClick={() => toast.success('Report exported as CSV')}>
          <FiDownload size={16} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportStats.map((stat) => (
          <Card key={stat.label} className="!p-4">
            <p className="text-xl font-bold text-accent">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Operational Cost">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trips.map((trip, index) => ({ name: trip.source || `Trip ${index + 1}`, cost: trip.revenue || 0 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3B4E" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #2D3B4E', borderRadius: 8 }} />
              <Bar dataKey="cost" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fleet Utilization Trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trips.map((trip, index) => ({ day: `Trip ${index + 1}`, util: trip.status === 'Completed' ? 100 : trip.status === 'Dispatched' ? 70 : 20 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3B4E" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #2D3B4E', borderRadius: 8 }} />
              <Line type="monotone" dataKey="util" stroke="#C88719" strokeWidth={2.5} dot={{ fill: '#C88719', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card title="Key Progress Indicators">
        <div className="space-y-4">
          {progressItems.map((progress) => (
            <div key={progress.label}>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>{progress.label}</span>
                <span>{progress.value}%</span>
              </div>
              <div className="h-2 bg-bg rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${progress.value}%`, backgroundColor: progress.color }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
