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
      <form className="form">
        <label htmlFor="url">Your long URL</label>
        <input type="url" value="http://localhost:8080/" disabled />
        <label htmlFor="code">Your shortened URL</label>
        <input type="text" id="code" value="http://localhost:8080/" disabled />
        <button className="return-button" onClick={handleShowCustomForm}>
          Shorten another
        </button>
      </form>
    </div>
  )
}

export default ShowUrl
