import axios from './custom_axios'

class UserService {
  async getUser() {
    const res = await axios.get('api/users/info')
    return res.data
  }
}

export default new UserService()
