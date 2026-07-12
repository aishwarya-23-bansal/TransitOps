export const kpis = [
  { label: 'Active Vehicles', value: 143, color: 'text-blue-400' },
  { label: 'Available Vehicles', value: 42, color: 'text-green-400' },
  { label: 'In Maintenance', value: 4, color: 'text-orange-400' },
  { label: 'Active Trips', value: 18, color: 'text-accent' },
  { label: 'Pending Trips', value: 9, color: 'text-yellow-400' },
  { label: 'Drivers On Duty', value: 26, color: 'text-blue-400' },
  { label: 'Fleet Utilization', value: '91%', color: 'text-green-400' },
]

export const recentTrips = [
  { id: 'TRP-1042', vehicle: 'MH12 AB 3345', driver: 'Rohan Verma', status: 'In Transit', progress: 65 },
  { id: 'TRP-1041', vehicle: 'MH14 CD 7788', driver: 'Sameer Iyer', status: 'Completed', progress: 100 },
  { id: 'TRP-1040', vehicle: 'MH04 EF 1290', driver: 'Priya Nair', status: 'Dispatched', progress: 30 },
  { id: 'TRP-1039', vehicle: 'MH01 XZ 5567', driver: 'Aman Gupta', status: 'Delayed', progress: 15 },
]

export const vehicleStatusSummary = [
  { name: 'Active', value: 143, color: '#4ADE80' },
  { name: 'Idle', value: 42, color: '#60A5FA' },
  { name: 'Maintenance', value: 4, color: '#FB923C' },
]

export const fleetUtilizationTrend = [
  { day: 'Mon', util: 78 },
  { day: 'Tue', util: 82 },
  { day: 'Wed', util: 75 },
  { day: 'Thu', util: 88 },
  { day: 'Fri', util: 91 },
  { day: 'Sat', util: 85 },
  { day: 'Sun', util: 80 },
]

export const vehicles = [
  { id: 1, registration: 'MH12 AB 3345', model: 'Tata Ace', type: 'Mini Truck', capacity: '750 kg', status: 'Active' },
  { id: 2, registration: 'MH14 CD 7788', model: 'Ashok Leyland Dost', type: 'LCV', capacity: '1250 kg', status: 'Idle' },
  { id: 3, registration: 'MH04 EF 1290', model: 'Mahindra Bolero Pickup', type: 'Pickup', capacity: '1700 kg', status: 'In Transit' },
  { id: 4, registration: 'MH01 XZ 5567', model: 'Eicher Pro 2049', type: 'Truck', capacity: '4900 kg', status: 'Maintenance' },
  { id: 5, registration: 'MH20 GH 4432', model: 'Tata 407', type: 'Mini Truck', capacity: '2500 kg', status: 'Active' },
]

export const drivers = [
  { id: 1, name: 'Rohan Verma', license: 'MH12 20210034521', expiry: '2026-09-14', contact: '+91 98220 11234', safetyScore: 92, status: 'On Duty' },
  { id: 2, name: 'Sameer Iyer', license: 'MH14 20190087742', expiry: '2026-08-02', contact: '+91 99870 55123', safetyScore: 88, status: 'Off Duty' },
  { id: 3, name: 'Priya Nair', license: 'MH04 20200019987', expiry: '2027-01-20', contact: '+91 90040 22119', safetyScore: 95, status: 'On Duty' },
  { id: 4, name: 'Aman Gupta', license: 'MH01 20180056612', expiry: '2026-07-30', contact: '+91 91234 88771', safetyScore: 74, status: 'Suspended' },
]

export const tripHistory = [
  { id: 'TRP-1038', source: 'Pune', destination: 'Mumbai', vehicle: 'MH12 AB 3345', status: 'Completed', date: '2026-07-10' },
  { id: 'TRP-1037', source: 'Nagpur', destination: 'Nashik', vehicle: 'MH20 GH 4432', status: 'Completed', date: '2026-07-09' },
  { id: 'TRP-1036', source: 'Mumbai', destination: 'Surat', vehicle: 'MH04 EF 1290', status: 'Cancelled', date: '2026-07-08' },
]

export const maintenanceRecords = [
  { id: 1, vehicle: 'MH01 XZ 5567', issue: 'Brake pad replacement', cost: 4500, status: 'In Progress', start: '2026-07-08', end: '2026-07-14' },
  { id: 2, vehicle: 'MH14 CD 7788', issue: 'Oil change & filter', cost: 1800, status: 'Completed', start: '2026-07-01', end: '2026-07-02' },
  { id: 3, vehicle: 'MH12 AB 3345', issue: 'Tyre rotation', cost: 2200, status: 'Scheduled', start: '2026-07-15', end: '2026-07-16' },
]

export const fuelLogs = [
  { id: 1, vehicle: 'MH12 AB 3345', date: '2026-07-10', liters: 45, cost: 4230 },
  { id: 2, vehicle: 'MH04 EF 1290', date: '2026-07-09', liters: 60, cost: 5640 },
]

export const expenseLogs = [
  { id: 1, vehicle: 'MH01 XZ 5567', category: 'Toll', date: '2026-07-10', cost: 620 },
  { id: 2, vehicle: 'MH20 GH 4432', category: 'Parking', date: '2026-07-08', cost: 150 },
]

export const reportStats = [
  { label: 'Fleet Utilization', value: '91%' },
  { label: 'Fuel Efficiency', value: '14.2 km/l' },
  { label: 'Operational Cost', value: '₹34,070' },
  { label: 'ROI', value: '4.6%' },
]

export const monthlyCostTrend = [
  { month: 'Jan', cost: 28000 }, { month: 'Feb', cost: 31000 }, { month: 'Mar', cost: 26500 },
  { month: 'Apr', cost: 33000 }, { month: 'May', cost: 35500 }, { month: 'Jun', cost: 30200 },
  { month: 'Jul', cost: 34070 },
]

export const users = [
  { id: 1, name: 'Aish Sharma', email: 'aish@transitops.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Rohan Verma', email: 'rohan@transitops.com', role: 'Dispatcher', status: 'Active' },
  { id: 3, name: 'Priya Nair', email: 'priya@transitops.com', role: 'Driver', status: 'Inactive' },
]

export const roles = [
  { id: 1, role: 'Admin', vehicles: true, drivers: true, trips: true, reports: true },
  { id: 2, role: 'Dispatcher', vehicles: false, drivers: true, trips: true, reports: false },
  { id: 3, role: 'Driver', vehicles: false, drivers: false, trips: true, reports: false },
]
