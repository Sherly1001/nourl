import './App.scss'
import Home from './pages/Home'
import MyUrl from './pages/MyUrl'
import NoPage from './pages/NoPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './comps/Header/Header'
import Login from './comps/Login/Login'

const App = () => {
  return (
    <>
      <div className="container">
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/my_url" element={<MyUrl />}></Route>
            <Route path="/*" element={<NoPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
      <Login />
    </>
  )
}

export default App
