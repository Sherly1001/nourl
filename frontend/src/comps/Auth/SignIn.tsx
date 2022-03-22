import Modal from '../Modal/Modal'
import ButtonBox from './ButtonBox'
import './style.scss'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'
import AuthStore from '../../stores/AuthStore'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'

const SignIn = () => {
  const { appStore } = useStores()
  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
    passwd: yup.string().required('Vui lòng nhập mật khẩu'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({ resolver: yupResolver(schema) })

  function onSigninSubmit(data: Object) {
    console.log(data)
  }

  function handleSignupModalOpen() {
    appStore.setSigninModalVisible(false)
    appStore.setSignupModalVisible(true)
  }

  useEffect(() => {
    clearErrors(['email', 'passwd'])
  }, [appStore.isSigniModalVisible])

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
      <form className="form" onSubmit={handleSubmit(onSigninSubmit)}>
        <label htmlFor="email-signin">Email address</label>
        <input
          type="text"
          id="email-signin"
          placeholder="Enter your email"
          {...register('email')}
        />
        <p className="error">{errors.email?.message}</p>
        <label htmlFor="passwd-signin">Password</label>
        <input
          type="password"
          id="passwd-signin"
          placeholder="Enter your password"
          {...register('passwd')}
        />
        <p className="error">{errors.passwd?.message}</p>
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
