import './user-info.scss'
import { UserOutlined } from '@ant-design/icons'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState, useEffect, SyntheticEvent } from 'react'
import { toast } from 'react-toastify'

const UserInfo = () => {
  const { authStore } = useStores()
  const [isDisabledButtonEdit, setIsDisabledButtonEdit] = useState(true)
  const [isClickButtonEdit, setClickButtonEdit] = useState(false)
  const [avatar, setAvatar] = useState('')

  const schema = yup.object().shape({
    avatar: yup.string().url('Invalid url'),
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .nullable()
      .email('Email is invalidd')
      .required('Email is required'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({ resolver: yupResolver(schema) })

  const displayName =
    authStore.user?.display_name != 'none'
      ? authStore.user?.display_name
      : authStore.user?.email

  useEffect(() => {
    setValue('email', '')
    setValue('name', '')
    if (authStore.user) {
      if (authStore.user.display_name != 'none')
        setValue('name', authStore.user.display_name)
      if (authStore.user.email != 'none')
        setValue('email', authStore.user.email)
      if (authStore.user.avatar_url) {
        setValue('avatar', authStore.user.avatar_url)
        setAvatar(authStore.user.avatar_url)
      }
    }
  }, [authStore.user])

  function handleDisabledButtonEdit() {
    setIsDisabledButtonEdit(false)
  }
  function handleAvatarChange(e: SyntheticEvent) {
    setIsDisabledButtonEdit(false)
    const target = e.target as HTMLFormElement
    setAvatar(target.value)
  }
  function handleEditProfile() {
    setClickButtonEdit(true)
    toast.promise(
      authStore.updateUser({
        avatar_url: getValues('avatar') || null,
        email: getValues('email'),
        display_name: getValues('name'),
      }),
      {
        pending: 'Pending',
        success: {
          render() {
            setClickButtonEdit(false)
            return 'Update profile success'
          },
        },
        error: {
          render({ data }: any) {
            setClickButtonEdit(false)
            return `Update profile failed: ${data!.response.data.msg}`
          },
        },
      }
    )
  }

  return (
    <div className="profile-info">
      <form onSubmit={handleSubmit(handleEditProfile)}>
        <div className="info-header">
          <div className="info-header-img">
            {avatar ? (
              <img src={avatar} alt="avatar" className="user-avatar" />
            ) : authStore.user?.avatar_url != null ? (
              <img
                src={authStore.user?.avatar_url}
                alt="avatar-user"
                className="user-avatar"
              />
            ) : (
              <div className="user-img">
                <UserOutlined />
              </div>
            )}
          </div>
          <span className="user-name">{displayName}</span>
        </div>
        <label htmlFor="avatar">Avatar url</label>
        <input
          type="text"
          id="avatar"
          {...register('avatar', { onChange: (e) => handleAvatarChange(e) })}
        />
        <p className="error">{errors.avatar?.message}</p>
        <label htmlFor="name">Display name</label>
        <input
          type="text"
          id="name"
          {...register('name', { onChange: handleDisabledButtonEdit })}
        />
        <p className="error">{errors.name?.message}</p>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          {...register('email', { onChange: handleDisabledButtonEdit })}
        />
        <p className="error">{errors.email?.message}</p>
        <button
          className="edit-button"
          disabled={isDisabledButtonEdit || isClickButtonEdit}
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default observer(UserInfo)
