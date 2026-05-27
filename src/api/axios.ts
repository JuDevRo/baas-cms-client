import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export function setAuthToken(token?: string | null) {
//   if (token) localStorage.setItem('token', token)
//   else localStorage.removeItem('token')
// }

export default axiosInstance
