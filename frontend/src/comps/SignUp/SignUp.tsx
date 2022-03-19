import { useContext } from 'react'
import './signup.scss'
import {
  GooglePlusOutlined,
  GithubOutlined,
  FacebookOutlined,
} from '@ant-design/icons'
import { AppContext } from '../../shared/Context/AppProvider'
import Modal from '../Modal/Modal'

const SignUp = () => {
  const { isSignupModalVisible, setSignupModalVisible } = useContext(AppContext)

  return (
    <Modal
      visible={isSignupModalVisible}
      setVisible={setSignupModalVisible}
      className="signup"
    >
      <h2>Sign up</h2>
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
    </Modal>
  )
}

export default SignUp
