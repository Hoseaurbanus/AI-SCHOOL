import axios from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("clerk_session_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("clerk_session_token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const setAuthToken = (token: string) => {
  localStorage.setItem("clerk_session_token", token)
}

export const clearAuthToken = () => {
  localStorage.removeItem("clerk_session_token")
}

export function useApi() {
  const getAuthHeaders = async () => {
    const token = localStorage.getItem("clerk_session_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  return { api, getAuthHeaders }
}
