import './buttonbox.scss'
import {
  GooglePlusOutlined,
  GithubOutlined,
  FacebookOutlined,
} from '@ant-design/icons'
import FacebookLogin from 'react-facebook-login'

const ButtonBox = () => {
  function responseFacebook(response: Object) {
    console.log(response)
  }

  return (
    <div className="button-box">
      <span className="signin-google button-item">
        <GooglePlusOutlined />
      </span>
      <span className="signin-github button-item">
        <GithubOutlined />
      </span>
      <FacebookLogin
        appId={import.meta.env.VITE_FB_CLIENT_ID as string}
        autoLoad={true}
        fields="name,email,picture"
        callback={responseFacebook}
        redirectUri="localhost:8080"
        cssClass="signin-facebook button-item"
        icon={<FacebookOutlined />}
        textButton=""
      />
    </div>
  )
}

export default ButtonBox
