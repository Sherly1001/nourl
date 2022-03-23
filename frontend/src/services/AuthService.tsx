import axios from './custom_axios'

class AuthService {
  async signin(email: string, passwd: string) {
    const res = await axios.post('api//users/signin', {
      method: {
        email: {
          email: email,
          passwd: passwd,
        },
      },
    })
    return res.data
  }

  async signup(email: string, passwd: string) {
    const res = await axios.post('api/users/create', {
      method: {
        email: {
          email: email,
          passwd: passwd,
        },
      },
    })
    return res.data
  }
}

export default new AuthService()
