import { User, Nullable } from '../shared/interfaces/index'
import { makeAutoObservable } from 'mobx'
import AuthService from '../services/AuthService'
import UserService from '../services/UserService'

class AuthStore {
  isAuth = false
  user: Nullable<User> = null

  constructor() {
    makeAutoObservable(this)
  }

  setUserAndIsAuth(user: Nullable<User>, isAuth: boolean) {
    this.user = user
    this.isAuth = isAuth
  }

  setIsAuth(isAuth: boolean) {
    this.isAuth = isAuth
  }

  setUser(user: User) {
    this.user = user
  }

  async signin(
    method: string,
    data: {
      email?: string
      passwd?: string
      access_token?: string
      code?: string
      id_token?: string
    }
  ) {
    let res = null
    switch (method) {
      case 'default':
        res = await AuthService.signinDefault(data.email!, data.passwd!)
        break
      case 'github':
        res = await AuthService.signinWithGithub(data.code!)
        break
      case 'facebook':
        res = await AuthService.signupWithFacebook(data.access_token!)
        break
      case 'google':
        res = await AuthService.signinWithGoogle(data.id_token!)
        break
      default:
        break
    }
    if (res.stt === 'ok') {
      const data = res.data
      setTimeout(() => {
        this.storeToken(data.token)
        this.setUserAndIsAuth(data.info, true)
      }, 1000)
      return true
    } else return res.data
  }

  async signup(
    method: string,
    data: {
      email?: string
      passwd?: string
      access_token?: string
      code?: string
      id_token?: string
    }
  ) {
    let res = null
    switch (method) {
      case 'default':
        res = await AuthService.signupDefault(data.email!, data.passwd!)
        break
      case 'github':
        res = await AuthService.signupWithGithub(data.code!)
        break
      case 'facebook':
        res = await AuthService.signupWithFacebook(data.access_token!)
        break
      case 'google':
        res = await AuthService.signupWithGoogle(data.id_token!)
        break
      default:
        break
    }
    if (res.stt === 'ok') {
      const data = res.data
      setTimeout(() => {
        this.storeToken(data.token)
        this.setUserAndIsAuth(data.info, true)
      }, 1000)
      return true
    }
    return res.data
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken !== 'undefined' && accessToken) {
      return JSON.parse(accessToken)
    }
    return ''
  }

  checkLogin() {
    const accessToken = this.getAccessToken()
    if (accessToken) return true
    return false
  }

  storeToken(token: string) {
    localStorage.setItem('accessToken', JSON.stringify(token))
  }

  signout() {
    localStorage.removeItem('accessToken')
    this.setUserAndIsAuth(null, false)
  }

  async loadUser() {
    const res = await UserService.getUser()
    this.setUser(res.data)
  }
}

export default AuthStore
