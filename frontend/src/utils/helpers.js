export function statusColor(status) {
  const map = {
    Active: 'green',
    'On Duty': 'green',
    Completed: 'green',
    Idle: 'blue',
    Dispatched: 'blue',
    'In Transit': 'blue',
    'Off Duty': 'blue',
    Scheduled: 'blue',
    Maintenance: 'orange',
    'In Progress': 'orange',
    Pending: 'orange',
    Delayed: 'red',
    Cancelled: 'red',
    Suspended: 'red',
    Draft: 'gray',
  }
  return map[status] || 'gray'
}

export function isExpiringSoon(dateStr, days = 30) {
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24)
  return diff <= days
}

export function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`
}

export function paginate(items, page, perPage) {
  const start = (page - 1) * perPage
  return items.slice(start, start + perPage)
}
