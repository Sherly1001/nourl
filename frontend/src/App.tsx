import './App.scss'
import Home from './pages/Home'
import MyUrl from './pages/MyUrl'
import NoPage from './pages/NoPage'
import { Routes, Route } from 'react-router-dom'
import Header from './comps/Header/Header'

const App = () => {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Home />}></Route>
            <Route path="/my_url" element={<MyUrl />}></Route>
            <Route path="/*" element={<NoPage />}></Route>
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
