import { useContext } from 'react'
import './header.scss'
import { logoImg } from '../../assests/images'
import { AppContext } from '../../shared/Context/AppProvider'
import LinkCustom from './LinkCustom'
import { Outlet } from 'react-router-dom'

const Header = ({}) => {
  const { setLoginModalVisible } = useContext(AppContext)

  function handleModalVisible() {
    setLoginModalVisible(true)
  }

  return (
    <div className="header">
      <div className="header-inner">
        <div className="logo">
          <img src={logoImg} alt="" />
          <h2>NoUrl</h2>
        </div>
        <nav className="navbar">
          <LinkCustom to="/">Home</LinkCustom>
          <LinkCustom to="/my_url">MyUrl</LinkCustom>
        </nav>
        <button className="signin" onClick={handleModalVisible}>
          Sign in
        </button>
      </div>

      <Outlet />
    </div>
  )
}

export default Header
