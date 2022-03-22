import './header.scss'
import { logoImg, logoText } from '../../assests/images'
import LinkCustom from './LinkCustom'
import { Outlet } from 'react-router-dom'
import SignUp from '../Auth/SignUp'
import SignIn from '../Auth/SignIn'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'

const Header = ({}) => {
  const { appStore } = useStores()

  function handleSigninModalVisible() {
    appStore.setSigninModalVisible(true)
  }
  function handleSignupModalVisible() {
    appStore.setSignupModalVisible(true)
  }

  return (
    <>
      <div className="header">
        <div className="header-inner">
          <LinkCustom to="/" className="header-logo">
            <img className="imgLogo" src={logoImg} alt="" />
            <img className="textLogo" src={logoText} alt="" />
          </LinkCustom>
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

export default observer(Header)
