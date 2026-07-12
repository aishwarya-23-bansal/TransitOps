import Card from './Card.jsx'

export default function ChartCard({ title, children, action }) {
  return (
    <Card title={title} action={action}>
      <div className="h-64">{children}</div>
    </Card>
  )
}
