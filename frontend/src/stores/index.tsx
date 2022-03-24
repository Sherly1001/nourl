import { createContext, useContext } from 'react'
import AppStore from './AppStore'
import AuthStore from './AuthStore'
import UrlsStore from './UrlStore'

const storeContext = createContext({
  appStore: new AppStore(),
  authStore: new AuthStore(),
  urlsStore: new UrlsStore(),
})

const useStores = () => useContext(storeContext)

export default useStores
