import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VehicleRegistry from './pages/VehicleRegistry.jsx'
import DriverManagement from './pages/DriverManagement.jsx'
import TripManagement from './pages/TripManagement.jsx'
import Maintenance from './pages/Maintenance.jsx'
import FuelExpenses from './pages/FuelExpenses.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#E5E7EB',
            border: '1px solid #2D3748',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#C88719', secondary: '#1E293B' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fleet" element={<VehicleRegistry />} />
            <Route path="/drivers" element={<DriverManagement />} />
            <Route path="/trips" element={<TripManagement />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/fuel-expenses" element={<FuelExpenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}
