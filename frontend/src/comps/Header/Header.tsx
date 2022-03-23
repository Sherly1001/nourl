import './header.scss'
import { logoImg, logoText } from '../../assests/images'
import LinkCustom from './LinkCustom'
import { Outlet } from 'react-router-dom'
import SignUp from '../Auth/SignUp'
import SignIn from '../Auth/SignIn'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'
import { UserOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const Header = ({}) => {
  const { appStore, authStore } = useStores()

  function handleSigninModalVisible() {
    appStore.setSigninModalVisible(true)
  }
  function handleSignupModalVisible() {
    appStore.setSignupModalVisible(true)
  }

  useEffect(() => {
    if (authStore.checkLogin()) {
      authStore.setIsAuth(true)
      authStore.loadUser()
    }
  }, [])

  const displayName =
    authStore.user?.display_name != 'none'
      ? authStore.user?.display_name
      : authStore.user?.email

  function handleLogout() {
    authStore.signout()
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
          {authStore.isAuth || authStore.checkLogin() ? (
            <div className="header-user-info">
              <div className="user-dropdown">
                {authStore.user?.avatar_url != null ? (
                  <img src={authStore.user?.avatar_url} alt="user-img" />
                ) : (
                  <div className="avatar">
                    <UserOutlined />
                  </div>
                )}
                <div className="dropdown-list">
                  <span className="user-welcome">
                    <span>Hi, </span>
                    <span className="user-name">{displayName}</span>
                  </span>
                  <a href="#" className="logout" onClick={handleLogout}>
                    Log out
                  </a>
                </div>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default observer(Header)
