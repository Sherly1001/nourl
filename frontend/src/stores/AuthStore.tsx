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

  async signin(email: string, passwd: string) {
    const res = await AuthService.signin(email, passwd)
    if (res.stt === 'ok') {
      const data = res.data
      this.storeToken(data.token)
      this.setUserAndIsAuth(data.info, true)
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

  storeToken(token: string) {
    localStorage.setItem('accessToken', JSON.stringify(token))
  }

  signout() {
    localStorage.removeItem('accessToken')
    this.setUserAndIsAuth(null, false)
    localStorage.removeItem('userId')
  }

  async loadUser() {
    const res = await UserService.getUser()
    this.user = res.data
  }
}

export default AuthStore
