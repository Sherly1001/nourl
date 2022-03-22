import { createContext, useContext } from 'react'
import AppStore from './AppStore'

const storeContext = createContext({
  appStore: new AppStore(),
})

const useStores = () => useContext(storeContext)

export default useStores
