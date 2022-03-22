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

  setUser(user: Nullable<User>, isAuth: boolean) {
    this.user = user
    this.isAuth = isAuth
  }

  async signin(email: string, passwd: string) {
    const res = await AuthService.signin(email, passwd)
    if (res.success === true) {
      const accessToken = await res.data.data
      await this.storeToken(accessToken)
      let user!: User
      user.email = email
      const resGetUser = await UserService.getUser()
      user.id = await resGetUser.data.id
      this.setUser(user, true)
    } else return false
  }

  async signup(email: string, passwd: string) {
    const res = await AuthService.signup(email, passwd)
    if (res.stt === 'ok') return true
    return false
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

  async storeToken(token: string) {
    return localStorage.setItem('accessToken', JSON.stringify(token))
  }

  signout() {
    localStorage.removeItem('accessToken')
    this.setUser(null, false)
    localStorage.removeItem('userId')
  }

  get getUser() {
    return this.user
  }
}

export default new AuthStore()
