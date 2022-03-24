import './showurl.scss'
import { FormEvent } from 'react'
import { observer } from 'mobx-react-lite'
import { CopyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useStores from '../../stores/index'

interface ShowFormProps {
  show: boolean
  setShow: Function
  url: string
  code: string
}

const ShowUrl = ({ show, setShow, url, code }: ShowFormProps) => {
  const { appStore, authStore } = useStores()
  const navigate = useNavigate()
  function handleShowCustomForm(e: FormEvent) {
    e.preventDefault()
    setShow(!show)
  }

  function handleShowUrls(e: FormEvent) {
    e.preventDefault()
    if (authStore.isAuth) navigate('/my_url')
    else appStore.setSigninModalVisible(true)
  }

  function handleCopyUrlToClipBoard() {
    navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/${code}`)
  }

  return (
    <div className={`show-form ${!show ? 'd-none' : ''}`}>
      <form className="form">
        <label>Your long URL</label>
        <input type="url" value={url} disabled />
        <label>Your shortened URL</label>
        <div className="form-box">
          <input
            type="text"
            value={`${import.meta.env.VITE_API_URL}/${code}`}
            disabled
          />
          <CopyOutlined onClick={handleCopyUrlToClipBoard} />
        </div>
        <div className="button-box">
          <button className="myurl-button" onClick={handleShowUrls}>
            My URLs
          </button>
          <button className="return-button" onClick={handleShowCustomForm}>
            Shorten another
          </button>
        </div>
      </form>
    </div>
  )
}

export default observer(ShowUrl)
