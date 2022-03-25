import './style.scss'
import Modal from '../Modal/Modal'
import ButtonBox from './ButtonBox'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const SignUp = () => {
  const { appStore, authStore } = useStores()
  const [isClickSignupButtom, setClickSignupButtom] = useState(false)

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email required'),
    passwd: yup
      .string()
      .required('Password required')
      .min(6, 'Password must at least 6 characters'),
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

  const onSignupSubmit = () => {
    setClickSignupButtom(true)
    toast.promise(
      authStore.signup('default', {
        email: getValues('email'),
        passwd: getValues('passwd'),
      }),
      {
        pending: 'Pending',
        success: {
          render() {
            appStore.setSignupModalVisible(false)
            setClickSignupButtom(false)
            return 'Signup success'
          },
        },
        error: {
          render({ data }: any) {
            setClickSignupButtom(false)
            return `Signup failed: ${data!.response.data.msg}`
          },
        },
      }
    )
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
        <button
          className="signup-button"
          disabled={isClickSignupButtom ? true : false}
        >
          Sign up
        </button>
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
