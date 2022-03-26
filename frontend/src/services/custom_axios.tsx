import axios from 'axios'
import { api_url } from '../utils/const'

const axiosInstance = axios.create({
  baseURL: api_url as string,
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
