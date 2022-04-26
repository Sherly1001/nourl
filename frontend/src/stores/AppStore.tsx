import { makeAutoObservable } from 'mobx'

class AppStore {
  isSigniModalVisible: boolean
  isSignupModalVisible: boolean

  constructor(isSigniModalVisible = false, isSignupModalVisible = false) {
    makeAutoObservable(this)
    this.isSigniModalVisible = isSigniModalVisible
    this.isSignupModalVisible = isSignupModalVisible
  }

  setSigninModalVisible = (visible: boolean) => {
    document.body.style.overflow = visible ? 'hidden' : 'auto'
    this.isSigniModalVisible = visible
  }

  setSignupModalVisible = (visible: boolean) => {
    document.body.style.overflow = visible ? 'hidden' : 'auto'
    this.isSignupModalVisible = visible
  }
}

export default AppStore
