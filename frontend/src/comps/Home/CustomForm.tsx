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
    url: yup.string().url('Invalid url').required('Url is required'),
    code: yup
      .string()
      .required('Code is required')
      .matches(/^[^// ]+$/, 'Invalid code'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
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
            autoFocus
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
              <span>
                Your shortened URL may be overridden by others since you are not
                signed.
              </span>
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
