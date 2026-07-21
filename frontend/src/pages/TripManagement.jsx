import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import { tripAPI, vehicleAPI, driverAPI } from '../services/api.js'
import { statusColor } from '../utils/helpers.js'

const stages = ['Draft', 'Dispatched', 'Completed', 'Cancelled']

export default function TripManagement() {
  const { register, handleSubmit, reset } = useForm()
  const [activeStage, setActiveStage] = useState(1)
const [trips, setTrips] = useState([])
const [vehicles, setVehicles] = useState([])
const [drivers, setDrivers] = useState([])
const [selectedTrip, setSelectedTrip] = useState(null)
useEffect(() => {
  loadData()
}, [])

const loadData = async () => {
  try {
    const [tripRes, vehicleRes, driverRes] = await Promise.all([
      tripAPI.getAll(),
      vehicleAPI.getAll(),
      driverAPI.getAll(),
    ])

   setTrips(tripRes.data.trips || [])
    setVehicles(Array.isArray(vehicleRes.data) ? vehicleRes.data : [])
    setDrivers(Array.isArray(driverRes.data) ? driverRes.data : [])
  } catch (err) {
    console.error(err)
    toast.error('Failed to load data')
  }
}

  const onSubmit = async (data) => {
  try {
    const response = await tripAPI.create(data)

  const newTrip = response.data.trip

setTrips((prev) => [newTrip, ...prev])

setSelectedTrip(newTrip)

setActiveStage(stages.indexOf(newTrip.status))

toast.success('Trip created successfully')

    reset()
  } catch (err) {
    console.error(err)

    toast.error(
      err.response?.data?.message || 'Failed to dispatch trip'
    )
  }
}
const handleDispatch = async (id) => {
  try {
    await tripAPI.dispatch(id)

    toast.success('Trip dispatched')

    loadData()
  } catch (err) {
    console.error(err)

    toast.error(
      err.response?.data?.message || 'Failed to dispatch trip'
    )
  }
}

const handleCancel = async (id) => {
  try {
    await tripAPI.cancel(id)

    toast.success('Trip cancelled')

    loadData()
  } catch (err) {
    console.error(err)

    toast.error(
      err.response?.data?.message || 'Failed to cancel trip'
    )
  }
}

const handleComplete = async (id) => {
  try {
    await tripAPI.complete(id, {
      finalOdometer: 1000,
      fuelConsumed: 20,
      actualDistance: 150,
      revenue: 5000,
    })

    toast.success('Trip completed')

    loadData()
  } catch (err) {
    console.error(err)

    toast.error(
      err.response?.data?.message || 'Failed to complete trip'
    )
  }
}
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Create Trip">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Source" placeholder="e.g. Pune" {...register('source', { required: true })} />
            <Input label="Destination" placeholder="e.g. Mumbai" {...register('destination', { required: true })} />
          </div>
      <Dropdown
  label="Vehicle"
  options={vehicles.map((v) => ({
    label: `${v.registrationNumber} (${v.name})`,
    value: v._id,
  }))}
  {...register('vehicle', { required: true })}
/>
       <Dropdown
  label="Driver"
  options={drivers.map((d) => ({
    label: d.name,
    value: d._id,
  }))}
  {...register('driver', { required: true })}
/>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cargo Weight (kg)" type="number" placeholder="e.g. 1200" {...register('cargoWeight')} />
            <Input label="Distance (km)" type="number" placeholder="e.g. 148" {...register('plannedDistance', { required: true })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Dispatch</Button>
            <Button type="button" variant="secondary" onClick={() => reset()} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-6">
        <Card title="Trip Status Timeline">
          <div className="flex items-center">
            {stages.map((stage, i) => (
              <div key={stage} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                      i <= activeStage ? 'bg-accent border-accent text-white' : 'border-border text-gray-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-xs ${i <= activeStage ? 'text-gray-200' : 'text-gray-500'}`}>{stage}</span>
                </div>
                {i < stages.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 ${i < activeStage ? 'bg-accent' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Trip History">
          <div className="space-y-3">
         {trips.map((t) => (
  <div
    key={t._id}
    className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0"
  >
    <div>
      <p className="text-sm font-medium text-gray-200">
        {t.source} → {t.destination}
      </p>

      <p className="text-xs text-gray-500">
        {t.vehicle?.registrationNumber} · {t.driver?.name}
      </p>

      <p className="text-xs text-gray-500">
        {new Date(t.createdAt).toLocaleDateString()}
      </p>
    </div>

   <div className="flex flex-col items-end gap-2">
  <Badge color={statusColor(t.status)}>
    {t.status}
  </Badge>

  {t.status === 'Draft' && (
    <Button
      onClick={() => handleDispatch(t._id)}
      className="text-xs px-2 py-1"
    >
      Dispatch
    </Button>
  )}

  {t.status === 'Dispatched' && (
    <>
      <Button
        onClick={() => handleComplete(t._id)}
        className="text-xs px-2 py-1"
      >
        Complete
      </Button>

      <Button
        variant="secondary"
        onClick={() => handleCancel(t._id)}
        className="text-xs px-2 py-1"
      >
        Cancel
      </Button>
    </>
  )}
</div>
  </div>
))}
          </div>
        </Card>
      </div>
    </div>
  )
}
