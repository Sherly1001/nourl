import { createContext, useState, ReactNode } from 'react'
import { AppContextInterface } from '../interfaces'

interface AppProviderProps {
  children: ReactNode
}

const defaultAppProviderProps = {
  isSigniModalVisible: false,
  setSigninModalVisible: () => {},
  isSignupModalVisible: false,
  setSignupModalVisible: () => {},
}

export const AppContext = createContext<AppContextInterface>(
  defaultAppProviderProps
)

const AppProvider = ({ children }: AppProviderProps) => {
  const [isSigniModalVisible, setSigninModalVisible] = useState(false)
  const [isSignupModalVisible, setSignupModalVisible] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isSigniModalVisible,
        setSigninModalVisible,
        isSignupModalVisible,
        setSignupModalVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
