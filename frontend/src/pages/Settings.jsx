import { useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import Table from '../components/Table.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { users, roles } from '../data/dummyData.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { user } = useAuth()
  const [darkTheme, setDarkTheme] = useState(true)

  return (
    <div className="space-y-6">
      <Card title="Users">
        <Table
          columns={['Name', 'Email', 'Role', 'Status']}
          data={users}
          renderRow={(u) => (
            <>
              <td className="px-5 py-3 font-medium text-gray-200 whitespace-nowrap">{u.name}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{u.email}</td>
              <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{u.role}</td>
              <td className="px-5 py-3">
                <Badge color={u.status === 'Active' ? 'green' : 'gray'}>{u.status}</Badge>
              </td>
            </>
          )}
        />
      </Card>

      <Card title="Roles & Permissions">
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-border text-left text-xs text-gray-500 uppercase">
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Vehicles</th>
                <th className="px-5 py-3">Drivers</th>
                <th className="px-5 py-3">Trips</th>
                <th className="px-5 py-3">Reports</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="px-5 py-3 font-medium text-gray-200">{r.role}</td>
                  {[r.vehicles, r.drivers, r.trips, r.reports].map((val, i) => (
                    <td key={i} className="px-5 py-3">
                      {val ? <FiCheck className="text-green-400" /> : <FiX className="text-gray-600" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Profile Settings">
          <div className="space-y-4">
            <Input label="Name" defaultValue={user?.name || ''} />
            <Input label="Email" defaultValue={user?.email || ''} />
            <Button>Save Changes</Button>
          </div>
        </Card>

        <Card title="Preferences">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Dark Theme</p>
              <p className="text-xs text-gray-500">TransitOps is optimized for dark mode</p>
            </div>
            <button
              onClick={() => setDarkTheme((v) => !v)}
              className={`w-11 h-6 rounded-full relative transition-colors ${darkTheme ? 'bg-accent' : 'bg-border'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkTheme ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
