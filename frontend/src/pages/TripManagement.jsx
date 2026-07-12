import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import Dropdown from '../components/Dropdown.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import { vehicles, drivers, tripHistory } from '../data/dummyData.js'
import { statusColor } from '../utils/helpers.js'

const stages = ['Draft', 'Dispatched', 'Completed', 'Cancelled']

export default function TripManagement() {
  const { register, handleSubmit, reset } = useForm()
  const [activeStage, setActiveStage] = useState(1)

  const onSubmit = () => {
    toast.success('Trip dispatched')
    setActiveStage(1)
    reset()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Create Trip">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Source" placeholder="e.g. Pune" {...register('source', { required: true })} />
            <Input label="Destination" placeholder="e.g. Mumbai" {...register('destination', { required: true })} />
          </div>
          <Dropdown label="Vehicle" options={vehicles.map((v) => v.registration)} {...register('vehicle')} />
          <Dropdown label="Driver" options={drivers.map((d) => d.name)} {...register('driver')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cargo Weight (kg)" type="number" placeholder="e.g. 1200" {...register('cargoWeight')} />
            <Input label="Distance (km)" type="number" placeholder="e.g. 148" {...register('distance')} />
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
            {tripHistory.map((t) => (
              <div key={t.id} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-200">{t.source} → {t.destination}</p>
                  <p className="text-xs text-gray-500">{t.vehicle} · {t.date}</p>
                </div>
                <Badge color={statusColor(t.status)}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
