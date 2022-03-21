import { useContext } from 'react'
import './header.scss'
import { logoImg, logoText } from '../../assests/images'
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
    <>
      <div className="header">
        <div className="header-inner">
          <a href="/" className="header-logo">
            <img className="imgLogo" src={logoImg} alt="" />
            <img className="textLogo" src={logoText} alt="" />
          </a>
          <nav className="header-navbar">
            <LinkCustom to="/">Home</LinkCustom>
            <LinkCustom to="/my_url">MyUrls</LinkCustom>
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
      </div>
      <Outlet />
    </>
  )
}

export default Header
