import { createContext, useContext } from 'react'
import AppStore from './AppStore'
import AuthStore from './AuthStore'

const storeContext = createContext({
  appStore: new AppStore(),
  authStore: new AuthStore(),
})

const useStores = () => useContext(storeContext)

export default useStores
