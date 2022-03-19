import { useContext, useEffect, useRef } from 'react'
import './login.scss'
import {
  GooglePlusOutlined,
  GithubOutlined,
  FacebookOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { AppContext } from '../../shared/Context/AppProvider'

const Login = () => {
  const { isModalLoginVisible, setLoginModalVisible } = useContext(AppContext)
  const modalElement = useRef<HTMLHeadingElement>(null)
  const modalContainerElement = useRef<HTMLHeadingElement>(null)

  function handleCloseModal() {
    setLoginModalVisible(false)
  }

  useEffect(() => {
    window.onclick = (e) => {
      if (
        !modalContainerElement.current?.contains(e.target as Node) &&
        modalElement.current?.contains(e.target as Node)
      )
        setLoginModalVisible(false)
    }
  }, [])

  return (
    <div
      className={`modal overlay ${isModalLoginVisible ? 'active' : ''}`}
      ref={modalElement}
    >
      <div className="modal-container" ref={modalContainerElement}>
        <div className="modal-content">
          <div className="close-icon" onClick={handleCloseModal}>
            <CloseCircleOutlined />
          </div>
          <h2>Sign in</h2>
          <p className="desc">
            Create an account to unlock all the features <br></br>
            like save or see your urls.
          </p>
          <a href="#" className="signin-google signin-button">
            <GooglePlusOutlined />
            <span>Google</span>
          </a>
          <a href="#" className="signin-github signin-button">
            <GithubOutlined />
            <span>Github</span>
          </a>
          <a href="#" className="signin-facebook signin-button">
            <FacebookOutlined />
            <span>Facebook</span>
          </a>
          <div className="terms">
            By signing in you agree to our Terms of <br></br>Service and Privacy
            Policy.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
