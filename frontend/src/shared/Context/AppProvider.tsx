import { createContext, useState, FC, ReactNode } from 'react'
import { AppContextInterface } from '../interfaces'

interface AppProviderProps {
  children: ReactNode
}

export const AppContext = createContext<AppContextInterface | null>(null)

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [isModalLoginVisible, setLoginModalVisible] = useState(false)

  return (
    <AppContext.Provider value={{ isModalLoginVisible, setLoginModalVisible }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
