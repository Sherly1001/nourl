import { useContext } from 'react'
import './signin.scss'
import {
  GooglePlusOutlined,
  GithubOutlined,
  FacebookOutlined,
} from '@ant-design/icons'
import { AppContext } from '../../shared/Context/AppProvider'
import Modal from '../Modal/Modal'

const SignIn = () => {
  const { isSigniModalVisible, setSigninModalVisible } = useContext(AppContext)

  return (
    <Modal
      visible={isSigniModalVisible}
      setVisible={setSigninModalVisible}
      className="signin"
    >
      <h2>Sign in</h2>
      <p className="desc">
        Create an account to unlock all the features <br></br>
        like save or see your urls.
      </p>
      <form className="form">
        <label htmlFor="email">Email address</label>
        <input type="email" id="email" placeholder="Enter your email" />
        <label htmlFor="passwd">Password address</label>
        <input type="password" id="passwd" placeholder="Enter your password" />
        <button className="signin-button signin-default">Sign in</button>
      </form>
      <span className="seperate">or</span>
      <a href="#" className="signin-google signin-button">
        <GooglePlusOutlined />
        <span>Continue with Google</span>
      </a>
      <a href="#" className="signin-github signin-button">
        <GithubOutlined />
        <span>Continue with Github</span>
      </a>
      <a href="#" className="signin-facebook signin-button">
        <FacebookOutlined />
        <span>Continue with Facebook</span>
      </a>
      <div className="terms">
        By signing in you agree to our Terms of <br></br>Service and Privacy
        Policy.
      </div>
    </Modal>
  )
}

export default SignIn
