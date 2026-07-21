import axios from 'axios'
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
}
export const fuelAPI = {
  getAll: () => api.get('/fuel'),
  create: (data) => api.post('/fuel', data),
}

export const expenseAPI = {
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
}
export const maintenanceAPI = {
  getAll: () => api.get('/maintenance'),
  create: (data) => api.post('/maintenance', data),
  close: (id) => api.patch(`/maintenance/${id}/close`),
}

api.interceptors.request.use((config) => {
  const user = sessionStorage.getItem('transitops_user')
  if (user) {
    const { token } = JSON.parse(user)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


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

  dispatch: (id) => api.patch(`/trips/${id}/dispatch`),

  complete: (id, payload) =>
    api.patch(`/trips/${id}/complete`, payload),

  cancel: (id) => api.patch(`/trips/${id}/cancel`),

  update: (id, payload) => api.put(`/trips/${id}`, payload),
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
