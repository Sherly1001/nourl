import Modal from '../Modal/Modal'
import ButtonBox from './ButtonBox'
import './style.scss'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'

const SignIn = () => {
  const { appStore } = useStores()

  function handleSignupModalOpen() {
    appStore.setSigninModalVisible(false)
    appStore.setSignupModalVisible(true)
  }

  return (
    <Modal
      visible={appStore.isSigniModalVisible}
      setVisible={() => appStore.setSigninModalVisible(false)}
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

export default observer(SignIn)
