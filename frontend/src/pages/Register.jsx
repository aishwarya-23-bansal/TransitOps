import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import { authAPI } from '../services/api.js'
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })

      toast.success('Registration successful! Please login.')

      navigate('/login')
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-100">
          Create Account
        </h2>

        <Input
          label="Full Name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />

        <Input
          label="Email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Minimum 6 characters',
            },
          })}
          error={errors.password?.message}
        />

        <Dropdown
          label="Role"
          options={[
            'FleetManager',
            'Driver',
            'SafetyOfficer',
            'FinancialAnalyst',
          ]}
          {...register('role', {
            required: 'Role is required',
          })}
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