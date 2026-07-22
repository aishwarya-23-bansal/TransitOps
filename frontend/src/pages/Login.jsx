import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiTruck, FiMap, FiTool, FiBarChart2 } from 'react-icons/fi'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { authAPI } from '../services/api.js'

const features = [
  { icon: FiTruck, label: 'Fleet Tracking' },
  { icon: FiMap, label: 'Trip Dispatching' },
  { icon: FiTool, label: 'Maintenance Logs' },
  { icon: FiBarChart2, label: 'Cost Analytics' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'FleetManager',
    remember: false,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.email.trim()) nextErrors.email = 'Email is required'
    if (!formData.password) nextErrors.password = 'Password is required'
    if (formData.password && formData.password.length < 6) nextErrors.password = 'Minimum 6 characters'
    return nextErrors
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      login(response.data)
      toast.success(`Welcome ${response.data.name}`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-bg">
      <div className="hidden lg:flex w-[420px] bg-gray-100 text-gray-900 flex-col justify-between p-10 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-bold text-white">T</div>
            <span className="text-xl font-bold tracking-tight">TransitOps</span>
          </div>
          <p className="text-sm text-gray-500 mb-10">Smart Fleet &amp; Trip Management</p>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Core Features</p>
          <ul className="space-y-3">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Icon size={15} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-gray-400">© 2026 TransitOps. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-gray-100 mb-1">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mb-8">Enter your credentials to access the fleet console</p>

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@transitops.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <Dropdown
              label="Login As"
              name="role"
              placeholder="Select role"
              value={formData.role}
              onChange={handleChange}
              options={['FleetManager', 'Driver', 'SafetyOfficer', 'FinancialAnalyst']}
            />

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="accent-accent"
                />
                Remember Me
              </label>
              <a href="#" className="text-accent hover:text-accent-light transition-colors">
                Forgot Password?
              </a>
            </div>

            <Button type="submit" className="w-full mt-2">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
