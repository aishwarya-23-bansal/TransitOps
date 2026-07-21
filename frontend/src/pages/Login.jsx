import { useForm } from 'react-hook-form'
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
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()

 const onSubmit = async (data) => {
  try {
    const response = await authAPI.login({
      email: data.email,
      password: data.password,
       role: data.role,
    })

    login(response.data)

    toast.success(`Welcome ${response.data.name}`)

    navigate('/dashboard')
  } catch (error) {
    toast.error(
      error.response?.data?.message || 'Login failed'
    )
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-gray-100 mb-1">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mb-8">Enter your credentials to access the fleet console</p>

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@transitops.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            />
           <Dropdown
  label="Login As"
  placeholder="Select role"
  options={[
    'FleetManager',
    'Driver',
    'SafetyOfficer',
    'FinancialAnalyst',
  ]}
  {...register('role')}
/>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="accent-accent" {...register('remember')} />
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
