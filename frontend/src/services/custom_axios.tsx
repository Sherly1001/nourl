import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    'Access-Control-Max-Age': 86400,
    mode: 'no-cors',
    credentials: 'include',
  },
})

axiosInstance.interceptors.request.use((config: any) => {
  const accessToken = localStorage.getItem('accessToken')
  config.headers['Authorization'] = `Bearer ${
    accessToken && JSON.parse(accessToken)
  }`
  config.headers['Acces-Control-Allow-Origin'] = '*'
  config.headers['Acces-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE'
  ;(config.headers['Acces-Contorl-Allow-Methods'] = 'Content-Type'),
    'Authorization'
  config.headers['mode'] = 'no-cors'
  return config
})

export default axiosInstance
