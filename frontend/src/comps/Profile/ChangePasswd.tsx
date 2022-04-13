import './change-passwd.scss'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import useStores from '../../stores'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Nullable } from '../../shared/interfaces/index'

const ChangePasswd = () => {
  const { authStore } = useStores()
  const [isClickButtonChangePasswd, setClickButtonChangePasswd] =
    useState(false)

  const schema = yup.object().shape({
    old_passwd: authStore.user?.hash_passwd
      ? yup.string().required('Old password is required')
      : yup.string().nullable(),
    new_passwd: yup
      .string()
      .required('New password is required')
      .min(6, 'Password must at least 6 characters'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: yupResolver(schema) })

  function handleChangePasswdSubmit() {
    setClickButtonChangePasswd(true)
    toast.promise(
      authStore.changePasswd(
        authStore.user?.hash_passwd ? getValues('old_passwd') : null,
        getValues('new_passwd')
      ),
      {
        pending: 'Pending',
        success: {
          render() {
            setClickButtonChangePasswd(false)
            return 'Change password success'
          },
        },
        error: {
          render({ data }: any) {
            setClickButtonChangePasswd(false)
            return `Change password failed: ${data!.response.data.msg}`
          },
        },
      }
    )
  }

  return (
    <div className="change-passwd">
      <form onSubmit={handleSubmit(handleChangePasswdSubmit)}>
        {authStore.user?.hash_passwd ? (
          <>
            <label htmlFor="old_password">Old password</label>
            <input
              placeholder="Enter old password"
              type="password"
              id="old_password"
              {...register('old_passwd')}
            />
            <p className="error">{errors.old_passwd?.message}</p>
          </>
        ) : null}
        <label htmlFor="new_password">New password</label>
        <input
          placeholder="Enter new password"
          type="password"
          id="new_password"
          {...register('new_passwd')}
        />
        <p className="error">{errors.new_passwd?.message}</p>
        <button
          className="change-button"
          disabled={isClickButtonChangePasswd ? true : false}
        >
          Change Password
        </button>
      </form>
    </div>
  )
}

export default observer(ChangePasswd)
