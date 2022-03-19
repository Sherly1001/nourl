import { useContext } from 'react'
import './header.scss'
import { logoImg } from '../../assests/images'
import { AppContext } from '../../shared/Context/AppProvider'

const Header = () => {
  const value = useContext(AppContext)
  const { setLoginModalVisible } = value

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
        <ul className="navbar">
          <li className="active">Home</li>
          <li>MyUrl</li>
        </ul>
        <button className="signin" onClick={handleModalVisible}>Sign in</button>
      </div>
    </div>
  )
}

export default Header
