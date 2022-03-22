import axios from './custom_axios'

class AuthService {
  async signin(email: string, passwd: string) {
    const res = await axios.post('/users/signin', { email, passwd })
    return res.data
  }

  async signup(email: string, passwd: string) {
    const res = await axios.post('/users/create', { email, passwd })
    return res.data
  }
}

export default new AuthService()
