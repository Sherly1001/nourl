import './App.scss'
import Home from './pages/Home'
import MyUrls from './pages/MyUrls'
import NoPage from './pages/NoPage'
import { Routes, Route } from 'react-router-dom'
import Header from './comps/Header/Header'
import { observer } from 'mobx-react-lite'

const App = () => {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Home />}></Route>
            <Route path="/my_url" element={<MyUrls />}></Route>
            <Route path="/*" element={<NoPage />}></Route>
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default observer(App)
