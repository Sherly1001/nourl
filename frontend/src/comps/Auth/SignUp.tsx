import './style.scss'
import Modal from '../Modal/Modal'
import ButtonBox from './ButtonBox'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import UserService from '../../services/UserService'

const SignUp = () => {
  const { appStore } = useStores()
  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
    passwd: yup
      .string()
      .required('Vui lòng nhập mật khẩu')
      .min(6, 'Mật khẩu ít nhất 6 kí tự'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
  } = useForm({ resolver: yupResolver(schema) })

  function handleSigninModalOpen() {
    appStore.setSignupModalVisible(false)
    appStore.setSigninModalVisible(true)
  }

  function onSignupSubmit() {
    // AuthStore.signup(getValues('email'), getValues('passwd'))
  }

  useEffect(() => {
    clearErrors(['email', 'passwd'])
  }, [appStore.isSignupModalVisible])

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
      <form className="form" onSubmit={handleSubmit(onSignupSubmit)}>
        <label htmlFor="email-signup">Email address</label>
        <input
          type="text"
          id="email-signup"
          placeholder="Enter your email"
          {...register('email')}
        />
        <p className="error">{errors.email?.message}</p>
        <label htmlFor="passwd-signup">Password</label>
        <input
          type="password"
          id="passwd-signup"
          placeholder="Enter your password"
          {...register('passwd')}
        />
        <p className="error">{errors.passwd?.message}</p>
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
