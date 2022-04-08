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
    this.isSigniModalVisible = visible
  }

  setSignupModalVisible = (visible: boolean) => {
    this.isSignupModalVisible = visible
  }
}

export default AppStore
