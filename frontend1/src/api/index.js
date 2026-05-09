import axios from 'axios'

// ─── Axios Instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'https://expert-booking-system-w91b.onrender.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ─── Experts API ─────────────────────────────────────────────────────────────
export const expertsApi = {
  /** GET /api/experts?page=1&limit=9&search=&category=&minPrice=&maxPrice=&sortBy= */
  getAll: (params = {}) => api.get('/experts', { params }),

  /** GET /api/experts/:id */
  getById: (id) => api.get(`/experts/${id}`),

  /** GET /api/experts/:id/slots?date=YYYY-MM-DD */
  getSlots: (id, date) => api.get(`/experts/${id}/slots`, { params: { date } }),

  /** GET /api/experts/categories */
  getCategories: () => api.get('/experts/categories'),
}

// ─── Bookings API ─────────────────────────────────────────────────────────────
export const bookingsApi = {
  /**
   * POST /api/bookings
   * Body: { expertId, slotId, date, name, email, phone, notes }
   */
  create: (data) => api.post('/bookings', data),

  /** GET /api/bookings?email= */
  getMyBookings: (email) => api.get('/bookings', { params: { email } }),

  /** GET /api/bookings/:id */
  getById: (id) => api.get(`/bookings/${id}`),

  /** PATCH /api/bookings/:id/cancel */
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
}

export default api
