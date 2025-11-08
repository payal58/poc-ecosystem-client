import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Events API
export const eventsApi = {
  getAll: (params = {}) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getExternal: () => api.get('/events/external/fetch'),
}

// Organizations API
export const organizationsApi = {
  getAll: (params = {}) => api.get('/organizations', { params }),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  delete: (id) => api.delete(`/organizations/${id}`),
}

// Pathways API
export const pathwaysApi = {
  getAll: () => api.get('/pathways'),
  getById: (id) => api.get(`/pathways/${id}`),
  create: (data) => api.post('/pathways', data),
  update: (id, data) => api.put(`/pathways/${id}`, data),
  delete: (id) => api.delete(`/pathways/${id}`),
  query: (data) => api.post('/pathways/query', data),
}

// Search Logs API
export const searchApi = {
  log: (data) => api.post('/search/log', data),
  getLogs: () => api.get('/search/logs'),
}

export default api




