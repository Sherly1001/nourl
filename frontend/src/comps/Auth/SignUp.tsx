import './style.scss'
import Modal from '../Modal/Modal'
import ButtonBox from './ButtonBox'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'

const SignUp = () => {
  const { appStore } = useStores()

  function handleSigninModalOpen() {
    appStore.setSignupModalVisible(false)
    appStore.setSigninModalVisible(true)
  }

  return (
    <Modal
      visible={appStore.isSignupModalVisible}
      setVisible={appStore.setSignupModalVisible}
      className="signup"
    >
      <h2>Sign up</h2>
      <p className="desc">
        Create an account to unlock all the features <br></br>
        like save or edit your urls.
      </p>
      <form className="form">
        <label htmlFor="email-signup">Email address</label>
        <input
          type="email"
          id="email-signup"
          placeholder="Enter your email"
          required
        />
        <label htmlFor="passwd-signup">Password</label>
        <input
          type="password"
          id="passwd-signup"
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

export default observer(SignUp)
