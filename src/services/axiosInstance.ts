import axios from "axios"
import { AUTH_EXPIRED, getErrorStatus, getStored, removeStored } from "../utils"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStored("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (getErrorStatus(error) === 401 && getStored("token")) {
      removeStored("token")
      window.dispatchEvent(new Event(AUTH_EXPIRED))
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
