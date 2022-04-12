import axios from './custom_axios'

interface Info {
  avatar_url?: string
  email?: string
  display_name?: string
}

class UserService {
  async getUser() {
    const res = await axios.get('api/users/info')
    return res.data
  }

  async updateUser(info: Info) {
    const res = await axios.put('api/users/update', {
      info: {
        avatar_url: info.avatar_url,
        email: info.email,
        display_name: info.display_name,
      },
    })
    return res.data
  }

  async changePasswd(old_passwd: string | null, passwd: string) {
    const data = old_passwd
      ? {
          old_passwd,
          info: {
            passwd,
          },
        }
      : {
          info: {
            passwd,
          },
        }
    const res = await axios.put('api/users/update', data)
    return res.data
  }
}

export default new UserService()
