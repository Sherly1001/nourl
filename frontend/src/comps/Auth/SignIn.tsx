import Modal from '../Modal/Modal'
import ButtonBox from './ButtonBox'
import './style.scss'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SignIn = () => {
  const { appStore, authStore } = useStores()
  const [isClickSignInButtom, setClickSignInButtom] = useState(false)
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email required'),
    passwd: yup.string().required('Password required'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
  } = useForm({ resolver: yupResolver(schema) })

  function onSigninSubmit() {
    setClickSignInButtom(true)
    toast.promise(
      authStore.signin('default', {
        email: getValues('email'),
        passwd: getValues('passwd'),
      }),
      {
        pending: 'Signing up...',
        success: {
          render() {
            appStore.setSigninModalVisible(false)
            return 'Signin success'
          },
        },
        error: {
          render({ data }: any) {
            setClickSignInButtom(false)
            return `Signin failed: ${data!.response.data.msg}`
          },
        },
      }
    )
  }

  function handleSignupModalOpen() {
    appStore.setSigninModalVisible(false)
    appStore.setSignupModalVisible(true)
  }

  useEffect(() => {
    clearErrors(['email', 'passwd'])
  }, [appStore.isSigniModalVisible])

  return (
    <>
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
          <button
            className="signin-button"
            disabled={isClickSignInButtom ? true : false}
          >
            Sign in
          </button>
        </form>
        <div className="signup">
          Don't have an account?
          <span onClick={handleSignupModalOpen}>Sign up</span>
        </div>
        <span className="seperate">or Continue with</span>
        <ButtonBox></ButtonBox>
      </Modal>
    </>
  )
}

export default observer(SignIn)
