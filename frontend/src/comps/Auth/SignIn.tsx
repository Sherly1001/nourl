import { useContext } from 'react'
import { AppContext } from '../../shared/Context/AppProvider'
import Modal from '../Modal/Modal'
import ButtonBox from './ButtonBox'
import './style.scss'

const SignIn = () => {
  const { isSigniModalVisible, setSigninModalVisible, setSignupModalVisible } =
    useContext(AppContext)

  function handleSignupModalOpen() {
    setSigninModalVisible(false)
    setSignupModalVisible(true)
  }

  return (
    <Modal
      visible={isSigniModalVisible}
      setVisible={setSigninModalVisible}
      className="signin"
    >
      <h2>Sign in</h2>
      <p className="desc">
        Sign in to unlock all the features <br></br>
        like save or edit your urls.
      </p>
      <form className="form">
        <label htmlFor="email-signin">Email address</label>
        <input
          type="email"
          id="email-signin"
          placeholder="Enter your email"
          required
        />
        <label htmlFor="passwd-signin">Password</label>
        <input
          type="password"
          id="passwd-signin"
          placeholder="Enter your password"
          required
        />
        <button className="signin-button">Sign in</button>
      </form>
      <div className="signup">
        Don't have an account?
        <span onClick={handleSignupModalOpen}>Sign up</span>
      </div>
      <span className="seperate">or Continue with</span>
      <ButtonBox></ButtonBox>
    </Modal>
  )
}

export default SignIn