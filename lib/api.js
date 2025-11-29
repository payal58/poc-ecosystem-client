import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

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

// Programs API
export const programsApi = {
  getAll: (params = {}) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),
}

// Auth API
export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login-json', data),
  getMe: () => api.get('/auth/me'),
}

export default api




