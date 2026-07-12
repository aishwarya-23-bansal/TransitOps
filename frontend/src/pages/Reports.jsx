import { FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/Card.jsx'
import ChartCard from '../components/ChartCard.jsx'
import Button from '../components/Button.jsx'
import { reportStats, fleetUtilizationTrend, monthlyCostTrend } from '../data/dummyData.js'

export default function Reports() {
  const progressItems = [
    { label: 'Fleet Utilization', value: 91, color: '#4ADE80' },
    { label: 'Fuel Efficiency Target', value: 78, color: '#EF4444' },
    { label: 'Cost Control', value: 64, color: '#60A5FA' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button variant="secondary" className="flex items-center gap-2" onClick={() => toast.success('Report exported as CSV')}>
          <FiDownload size={16} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportStats.map((s) => (
          <Card key={s.label} className="!p-4">
            <p className="text-xl font-bold text-accent">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Operational Cost">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCostTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3B4E" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #2D3B4E', borderRadius: 8 }} />
              <Bar dataKey="cost" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fleet Utilization Trend">
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

      <Card title="Key Progress Indicators">
        <div className="space-y-4">
          {progressItems.map((p) => (
            <div key={p.label}>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>{p.label}</span>
                <span>{p.value}%</span>
              </div>
              <div className="h-2 bg-bg rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
