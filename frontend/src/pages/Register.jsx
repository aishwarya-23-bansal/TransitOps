import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import { authAPI } from '../services/api.js'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'FleetManager',
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Name is required'
    if (!formData.email.trim()) nextErrors.email = 'Email is required'
    if (!formData.password) nextErrors.password = 'Password is required'
    if (formData.password && formData.password.length < 6) nextErrors.password = 'Minimum 6 characters'
    if (!formData.role) nextErrors.role = 'Role is required'
    return nextErrors
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">Create Account</h2>

        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Dropdown
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={['FleetManager', 'Driver', 'SafetyOfficer', 'FinancialAnalyst']}
          error={errors.role}
        />

        <Button type="submit" className="w-full">
          Register
        </Button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-accent">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}