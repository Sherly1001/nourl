import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

axiosInstance.interceptors.request.use((config: any) => {
  const accessToken = localStorage.getItem('accessToken')
  config.headers['Authorization'] = `Bearer ${
    accessToken && JSON.parse(accessToken)
  }`
  return config
})

export default axiosInstance
