import './header.scss'
import { logoImg } from '../../assests/images'

const Header = () => {
  return (
    <div className="header">
      <div className="container header-inner">
        <div className="logo">
          <img src={logoImg} alt="" />
          <h2>NoUrl</h2>
        </div>
        <ul className="navbar">
          <li className="active">Home</li>
          <li>MyUrl</li>
        </ul>
        <button className="signin">Sign in</button>
      </div>
    </div>
  )
}

export default Header
