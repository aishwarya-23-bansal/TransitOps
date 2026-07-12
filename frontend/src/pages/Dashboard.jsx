import { useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import Card from '../components/Card.jsx'
import ChartCard from '../components/ChartCard.jsx'
import Badge from '../components/Badge.jsx'
import Dropdown from '../components/Dropdown.jsx'
import { kpis, recentTrips, vehicleStatusSummary, fleetUtilizationTrend } from '../data/dummyData.js'
import { statusColor } from '../utils/helpers.js'

export default function Dashboard() {
  const [filters, setFilters] = useState({ type: '', status: '', region: '' })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Dropdown
          className="w-40"
          placeholder="Vehicle Type"
          options={['Truck', 'LCV', 'Pickup', 'Mini Truck']}
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        />
        <Dropdown
          className="w-40"
          placeholder="Status"
          options={['Active', 'Idle', 'Maintenance']}
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        />
        <Dropdown
          className="w-40"
          placeholder="Region"
          options={['West', 'North', 'South', 'East']}
          value={filters.region}
          onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="!p-4">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1 leading-tight">{kpi.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Recent Trips" className="lg:col-span-2">
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-border text-left text-xs text-gray-500 uppercase">
                  <th className="px-5 py-2">Trip ID</th>
                  <th className="px-5 py-2">Vehicle</th>
                  <th className="px-5 py-2">Driver</th>
                  <th className="px-5 py-2">Status</th>
                  <th className="px-5 py-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-border/60 hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-200">{trip.id}</td>
                    <td className="px-5 py-3 text-gray-400">{trip.vehicle}</td>
                    <td className="px-5 py-3 text-gray-400">{trip.driver}</td>
                    <td className="px-5 py-3">
                      <Badge color={statusColor(trip.status)}>{trip.status}</Badge>
                    </td>
                    <td className="px-5 py-3 w-32">
                      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${trip.progress}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Vehicle Status Summary">
          <div className="space-y-3">
            {vehicleStatusSummary.map((v) => (
              <div key={v.name}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{v.name}</span>
                  <span>{v.value}</span>
                </div>
                <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(v.value / 189) * 100}%`, backgroundColor: v.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Vehicle Status Chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={vehicleStatusSummary} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {vehicleStatusSummary.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #2D3B4E', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fleet Utilization Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fleetUtilizationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3B4E" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #2D3B4E', borderRadius: 8 }} />
              <Line type="monotone" dataKey="util" stroke="#C88719" strokeWidth={2.5} dot={{ fill: '#C88719', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
