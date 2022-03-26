import './showurl.scss'
import { FormEvent, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { CopyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useStores from '../../stores/index'
import { go_url } from '../../utils/const'

interface ShowFormProps {
  show: boolean
  setShow: Function
  url: string
  code: string
}

const ShowUrl = ({ show, setShow, url, code }: ShowFormProps) => {
  const { appStore, authStore } = useStores()
  const navigate = useNavigate()
  const CopyElement = useRef<HTMLSpanElement>(null)

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
    const copyElement = CopyElement.current
    copyElement?.classList.add('show')
    setTimeout(() => {
      copyElement?.classList.remove('show')
    }, 600)
    navigator.clipboard.writeText(`${go_url}/${code}`)
  }

  return (
    <div className={`show-form ${!show ? 'd-none' : ''}`}>
      <form className="form">
        <label>Your long URL</label>
        <input type="url" value={url} disabled />
        <label>Your shortened URL</label>
        <div className="form-box">
          <a
            type="text"
            href={`${go_url}/${code}`}
            target="_blank"
            className="shortened-url"
          >{`${go_url}/${code}`}</a>
          <div className="copy">
            <CopyOutlined onClick={handleCopyUrlToClipBoard} />
            <span className="copied" aria-hidden={true} ref={CopyElement}>
              Copied
            </span>
          </div>
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
