import { FormEvent } from 'react'
import './customform.scss'

interface CustomFormProps {
  show: boolean
  setShow: Function
}

const CustomForm = ({ show, setShow }: CustomFormProps) => {
  function handleSubmitCustomUrl(e: FormEvent) {
    e.preventDefault()
    setShow(!show)
  }

  return (
    <div className={`custom-form ${show ? 'd-none' : ''}`}>
      <form className="form" onSubmit={handleSubmitCustomUrl}>
        <label htmlFor="url">Enter a long URL to be shortened</label>
        <input type="url" id="url" placeholder="Enter url" required />
        <label htmlFor="code">Code</label>
        <input type="text" id="code" placeholder="Enter code" />
        <div className="error"></div>
        <button className="customurl-button">Shorten URL</button>
      </form>
    </div>
  )
}

export default CustomForm
