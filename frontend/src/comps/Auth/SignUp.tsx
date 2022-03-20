import { useContext } from 'react'
import { AppContext } from '../../shared/Context/AppProvider'
import Modal from './Modal'
import ButtonBox from './ButtonBox'

const SignUp = () => {
  const { isSignupModalVisible, setSignupModalVisible, setSigninModalVisible } =
    useContext(AppContext)

  function handleSigninModalOpen() {
    setSignupModalVisible(false)
    setSigninModalVisible(true)
  }

  return (
    <Modal
      visible={isSignupModalVisible}
      setVisible={setSignupModalVisible}
      className="signup"
    >
      <h2>Sign up</h2>
      <p className="desc">
        Create an account to unlock all the features <br></br>
        like save or edit your urls.
      </p>
      <form className="form">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          required
        />
        <label htmlFor="passwd">Password</label>
        <input
          type="password"
          id="passwd"
          placeholder="Enter your password"
          required
        />
        <button className="signup-button">Sign up</button>
      </form>
      <div className="signin">
        Already a user?
        <span onClick={handleSigninModalOpen}>Sign in</span>
      </div>
      <span className="seperate">or Continue with</span>
      <ButtonBox></ButtonBox>
    </Modal>
  )
}

export default SignUp
