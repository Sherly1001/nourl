import axios from './custom_axios'

class AuthService {
  async signinDefault(email: string, passwd: string) {
    const res = await axios.post('api/users/login', {
      method: {
        email: {
          email,
          passwd,
        },
      },
    })
    return res.data
  }

  async signinWithFacebook(access_token: string) {
    const res = await axios.post('api/users/login', {
      method: {
        facebook: {
          access_token,
        },
      },
    })
    return res.data
  }

  async signinWithGithub(code: string) {
    const res = await axios.post('api/users/login', {
      method: {
        github: {
          code,
        },
      },
    })
    return res.data
  }

  async signinWithGoogle(id_token: string) {
    const res = await axios.post('api/users/login', {
      method: {
        google: {
          id_token,
        },
      },
    })
    return res.data
  }

  async signupDefault(email: string, passwd: string) {
    const res = await axios.post('api/users/create', {
      method: {
        email: {
          email,
          passwd,
        },
      },
    })
    return res.data
  }

  async signupWithFacebook(access_token: string) {
    const res = await axios.post('api/users/create', {
      method: {
        facebook: {
          access_token,
        },
      },
    })
    return res.data
  }

  async signupWithGithub(code: string) {
    const res = await axios.post('api/users/create', {
      method: {
        github: {
          code,
        },
      },
    })
    return res.data
  }

  async signupWithGoogle(id_token: string) {
    const res = await axios.post('api/users/create', {
      method: {
        google: {
          id_token,
        },
      },
    })
    console.log(res)

    return res.data
  }
}

export default new AuthService()
