import axios from 'axios'
import { env } from './env'
import { clearAuth, readAuth } from './authStorage'

/**
 * One axios instance for the whole app: attaches the bearer token to every
 * request, and clears auth + redirects to /login on a 401 response. Mirrors
 * the pattern the previous frontend used (api/client.js) — kept for Phase 2
 * (login/profile) but created now since it doesn't depend on anything not
 * already in place.
 */
export const api = axios.create({ baseURL: env.apiBaseUrl })

api.interceptors.request.use((config) => {
  const { token } = readAuth()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuth()
      if (typeof window !== 'undefined') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)
