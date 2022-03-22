import axios from 'axios'

class UserService {
  async getUser() {
    const res = await axios.get('/users/info')
    return res.data
  }
}

export default new UserService()
