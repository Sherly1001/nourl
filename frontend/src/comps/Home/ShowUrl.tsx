import './showurl.scss'
import { FormEvent } from 'react'

interface ShowFormProps {
  show: boolean
  setShow: Function
}

const ShowUrl = ({ show, setShow }: ShowFormProps) => {
  function handleShowCustomForm(e: FormEvent) {
    e.preventDefault()
    setShow(!show)
  }

  return (
    <div className={`show-form ${!show ? 'd-none' : ''}`}>
      <form className="form" onSubmit={handleShowCustomForm}>
        <label htmlFor="url">Your long URL</label>
        <input type="url" value="http://localhost:8080/" disabled />
        <label htmlFor="code">Your shortened URL</label>
        <input type="text" id="code" value="http://localhost:8080/" disabled />
        <div className="button-box">
          <button className="myurl-button">My URLs</button>
          <button className="return-button">Shorten another</button>
        </div>
      </form>
    </div>
  )
}

export default ShowUrl
