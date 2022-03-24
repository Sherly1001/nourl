import { WarningOutlined } from '@ant-design/icons'
import './customform.scss'
import useStores from '../../stores/index'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ShowUrl from './ShowUrl'

const CustomForm = () => {
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [code, setCode] = useState('')
  const [url, setUrl] = useState('')
  const { authStore, urlsStore } = useStores()
  const [isClickButtonCustomUrl, setClickButtonCustomUrl] = useState(false)
  const schema = yup.object().shape({
    url: yup
      .string()
      .url('Nhập đúng định dạng url')
      .required('Vui lòng nhập url'),
    code: yup.string().required('Vui lòng nhập code'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
  } = useForm({ resolver: yupResolver(schema) })

  function onSubmitCustomUrl() {
    setClickButtonCustomUrl(true)
    toast.promise(urlsStore.createNewUrl(getValues('url'), getValues('code')), {
      pending: 'Pending',
      success: {
        render({ data }: { data: { code: string; url: string } }) {
          setCode(data.code)
          setUrl(data.url)
          setShowCustomForm(!showCustomForm)
          setClickButtonCustomUrl(false)
          return 'Shorten success'
        },
      },
      error: {
        render({ data }: { data: { response: { data: { msg: string } } } }) {
          setClickButtonCustomUrl(false)
          return `Shorten failed: ${data!.response.data.msg}`
        },
      },
    })
  }
  return (
    <>
      <div className={`custom-form ${showCustomForm ? 'd-none' : ''}`}>
        <form className="form" onSubmit={handleSubmit(onSubmitCustomUrl)}>
          <label htmlFor="url">Enter a long URL to be shortened</label>
          <input
            type="text"
            id="url"
            placeholder="Enter url"
            disabled={isClickButtonCustomUrl ? true : false}
            {...register('url')}
          />
          <p className="error">{errors.url?.message}</p>
          <label htmlFor="code">Code</label>
          <input
            type="text"
            id="code"
            placeholder="Enter code"
            disabled={isClickButtonCustomUrl ? true : false}
            {...register('code')}
          />
          <p className="error">{errors.code?.message}</p>
          {authStore.isAuth ? (
            ''
          ) : (
            <div className="form-warning">
              <WarningOutlined />
              Warning: your shorten url may be overide by other since you are
              not signin
            </div>
          )}
          <button
            className="customurl-button"
            disabled={isClickButtonCustomUrl ? true : false}
          >
            Shorten URL
          </button>
        </form>
      </div>
      <ShowUrl
        show={showCustomForm}
        setShow={setShowCustomForm}
        url={url}
        code={code}
      />
    </>
  )
}

export default observer(CustomForm)
