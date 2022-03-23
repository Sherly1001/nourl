import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config: any) => {
  const accessToken = localStorage.getItem('accessToken')
  config.headers['Authorization'] = `${accessToken && JSON.parse(accessToken)}`
  return config
})

export default axiosInstance
