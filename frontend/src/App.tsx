import './App.scss'
import Home from './pages/Home'
import MyUrls from './pages/MyUrls'
import NoPage from './pages/NoPage'
import { Routes, Route } from 'react-router-dom'
import Header from './comps/Header/Header'
import { observer } from 'mobx-react-lite'
import useStores from './stores'
import Profile from './pages/Profile'
import SignUp from './comps/Auth/SignUp'
import SignIn from './comps/Auth/SignIn'

const App = () => {
  const { authStore } = useStores()
  return (
    <>
      <div className="wrapper">
        <div className="container">
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<Home />}></Route>
              {authStore.isAuth ? (
                <>
                  <Route path="/my_url" element={<MyUrls />}></Route>
                  <Route path="/profile/*" element={<Profile />}></Route>
                </>
              ) : (
                ''
              )}
              <Route path="/*" element={<NoPage />}></Route>
            </Route>
          </Routes>
        </div>
        <SignIn />
        <SignUp />
      </div>
    </>
  )
}

export default observer(App)
