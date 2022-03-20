import { useContext } from 'react'
import './header.scss'
import { logoImg } from '../../assests/images'
import { AppContext } from '../../shared/Context/AppProvider'
import LinkCustom from './LinkCustom'
import { Outlet } from 'react-router-dom'
import SignUp from '../Auth/SignUp'
import SignIn from '../Auth/SignIn'

const Header = ({}) => {
  const { setSigninModalVisible, setSignupModalVisible } =
    useContext(AppContext)

  function handleSigninModalVisible() {
    setSigninModalVisible(true)
  }
  function handleSignupModalVisible() {
    setSignupModalVisible(true)
  }

  return (
    <div className="header">
      <div className="header-inner">
        <div className="header-logo">
          <img src={logoImg} alt="" />
          <h2>NoUrl</h2>
        </div>
        <nav className="header-navbar">
          <LinkCustom to="/">Home</LinkCustom>
          <LinkCustom to="/my_url">MyUrl</LinkCustom>
        </nav>
        <div className="header-button">
          <button
            className="signin header-button-item"
            onClick={handleSigninModalVisible}
          >
            Sign in
          </button>
          <button
            className="signup header-button-item"
            onClick={handleSignupModalVisible}
          >
            Sign up
          </button>
          <SignIn />
          <SignUp />
        </div>
      </div>

      <Outlet />
    </div>
  )
}

export default Header
