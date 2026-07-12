import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const user = sessionStorage.getItem('transitops_user')
  if (user) {
    const { token } = JSON.parse(user)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: (payload) => api.post('/auth/login', payload),
}

export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),
  create: (payload) => api.post('/vehicles', payload),
  update: (id, payload) => api.put(`/vehicles/${id}`, payload),
  remove: (id) => api.delete(`/vehicles/${id}`),
}

export const driverAPI = {
  getAll: () => api.get('/drivers'),
  create: (payload) => api.post('/drivers', payload),
  update: (id, payload) => api.put(`/drivers/${id}`, payload),
  remove: (id) => api.delete(`/drivers/${id}`),
}

export const tripAPI = {
  getAll: () => api.get('/trips'),
  create: (payload) => api.post('/trips', payload),
  update: (id, payload) => api.put(`/trips/${id}`, payload),
}

export const maintenanceAPI = {
  getAll: () => api.get('/maintenance'),
  create: (payload) => api.post('/maintenance', payload),
}

export const fuelExpenseAPI = {
  getFuelLogs: () => api.get('/fuel'),
  getExpenses: () => api.get('/expenses'),
  addFuelLog: (payload) => api.post('/fuel', payload),
  addExpense: (payload) => api.post('/expenses', payload),
}

export const reportsAPI = {
  getSummary: () => api.get('/analytics/dashboard'),
}

export default api
