import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/Card.jsx'
import ChartCard from '../components/ChartCard.jsx'
import Badge from '../components/Badge.jsx'
import Dropdown from '../components/Dropdown.jsx'
import { vehicleAPI, driverAPI, tripAPI } from '../services/api.js'
import { statusColor } from '../utils/helpers.js'

export default function Dashboard() {
  const [filters, setFilters] = useState({ type: '', status: '', region: '' })
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trips, setTrips] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [v, d, t] = await Promise.all([
  vehicleAPI.getAll(),
  driverAPI.getAll(),
  tripAPI.getAll()
])

console.log("Vehicles:", v.data)
console.log("Drivers:", d.data)
console.log("Trips:", t.data)

setVehicles(Array.isArray(v.data) ? v.data : [])
setDrivers(Array.isArray(d.data) ? d.data : [])
setTrips(Array.isArray(t.data) ? t.data : (t.data.trips || []))
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [])
const filteredVehicles = vehicles.filter((v) => {
  const matchType =
    !filters.type || v.type === filters.type

  const matchStatus =
    !filters.status || v.status === filters.status

  const matchRegion =
    !filters.region || v.region === filters.region

  return matchType && matchStatus && matchRegion
})
  const activeVehicles = filteredVehicles.filter(
  (v) => v.status === 'On Trip'
).length
 const availableVehicles = filteredVehicles.filter(
  (v) => v.status === 'Available'
).length
 const inMaintenance = filteredVehicles.filter(
  (v) => v.status === 'In Shop'
).length
  const activeTrips = trips.filter(t => t.status === 'Dispatched').length
  const pendingTrips = trips.filter(t => t.status === 'Draft').length
  const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length
  const fleetUtilization = filteredVehicles.length
  ? Math.round((activeVehicles / filteredVehicles.length) * 100)
  : 0
 const totalRevenue = trips.reduce(
  (sum, trip) => sum + (trip.revenue || 0),
  0
)
 const kpis = [
  { label: 'Active Vehicles', value: activeVehicles, color: 'text-blue-400' },
  { label: 'Available Vehicles', value: availableVehicles, color: 'text-green-400' },
  { label: 'In Maintenance', value: inMaintenance, color: 'text-yellow-400' },
  { label: 'Active Trips', value: activeTrips, color: 'text-orange-400' },
  { label: 'Pending Trips', value: pendingTrips, color: 'text-purple-400' },
  { label: 'Drivers On Duty', value: driversOnDuty, color: 'text-cyan-400' },
  { label: 'Fleet Utilization', value: `${fleetUtilization}%`, color: 'text-green-400' },
  {
    label: 'Total Revenue',
    value: `₹${totalRevenue.toLocaleString()}`,
    color: 'text-emerald-400',
  },
]
  const vehicleStatusSummary = [
    { name: 'Available', value: availableVehicles, color: '#22C55E' },
    { name: 'On Trip', value: activeVehicles, color: '#3B82F6' },
    { name: 'In Shop', value: inMaintenance, color: '#EAB308' },
  ]

  const recentTrips = trips.slice(0, 5).map(t => ({
    id: t._id, vehicle: t.vehicle?.registrationNumber || '—', driver: t.driver?.name || '—',
    status: t.status, progress: t.status === 'Completed' ? 100 : t.status === 'Dispatched' ? 50 : 10,
  }))

  if (loading) return <div className="text-gray-400 py-10 text-center">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Dropdown className="w-40" placeholder="Vehicle Type" options={['Truck','Van','Mini']} value={filters.type} onChange={(e)=>setFilters(f=>({...f,type:e.target.value}))} />
        <Dropdown className="w-40" placeholder="Status" options={['Available','On Trip','In Shop']} value={filters.status} onChange={(e)=>setFilters(f=>({...f,status:e.target.value}))} />
        <Dropdown className="w-40" placeholder="Region" options={[
  ...new Set(
    vehicles
      .map((v) => v.region)
      .filter(Boolean)
  ),
]} value={filters.region} onChange={(e)=>setFilters(f=>({...f,region:e.target.value}))} />
      </div>
     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="!p-4">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1 leading-tight">{kpi.label}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Recent Trips" className="lg:col-span-2">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-gray-500 uppercase">
              <th className="px-5 py-2">Trip ID</th><th className="px-5 py-2">Vehicle</th><th className="px-5 py-2">Driver</th><th className="px-5 py-2">Status</th><th className="px-5 py-2">Progress</th>
            </tr></thead>
            <tbody>
              {recentTrips.length === 0 ? <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-500">No trips yet</td></tr> :
                recentTrips.map(trip => (
                  <tr key={trip.id} className="border-b border-border/60">
                    <td className="px-5 py-3">{trip.id?.slice(-6)}</td><td className="px-5 py-3">{trip.vehicle}</td><td className="px-5 py-3">{trip.driver}</td>
                    <td className="px-5 py-3"><Badge color={statusColor(trip.status)}>{trip.status}</Badge></td>
                    <td className="px-5 py-3 w-32"><div className="h-1.5 bg-bg rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full" style={{width:`${trip.progress}%`}}/></div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
        <Card title="Vehicle Status Summary">
          <div className="space-y-3">
            {vehicleStatusSummary.map(v => (
              <div key={v.name}>
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>{v.name}</span><span>{v.value}</span></div>
                <div className="h-1.5 bg-bg rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width: `${
  filteredVehicles.length
    ? (v.value / filteredVehicles.length) * 100
    : 0
}%`,backgroundColor:v.color}}/></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <ChartCard title="Vehicle Status Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={vehicleStatusSummary} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
              {vehicleStatusSummary.map(e => <Cell key={e.name} fill={e.color} stroke="none" />)}
            </Pie>
            <Tooltip contentStyle={{background:'#1E293B',border:'1px solid #2D3B4E',borderRadius:8}} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
