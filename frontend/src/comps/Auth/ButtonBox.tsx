import './buttonbox.scss'
import {
  GooglePlusOutlined,
  GithubOutlined,
  FacebookOutlined,
} from '@ant-design/icons'

const ButtonBox = () => {
  return (
    <div className="button-box">
      <a href="#" className="signin-google button-item">
        <GooglePlusOutlined />
      </a>
      <a href="#" className="signin-github button-item">
        <GithubOutlined />
      </a>
      <a href="#" className="signin-facebook button-item">
        <FacebookOutlined />
      </a>
    </div>
  )
}

export default ButtonBox
