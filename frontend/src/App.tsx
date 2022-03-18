import './App.scss'
import Home from './pages/Home'
import MyUrl from './pages/MyUrl'
import NoPage from './pages/NoPage'
import Header from './comps/Header/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Header></Header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/my_url" element={<MyUrl />}></Route>
          <Route path="/*" element={<NoPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
