import './buttonbox.scss'
import {
  GooglePlusOutlined,
  GithubOutlined,
  FacebookOutlined,
} from '@ant-design/icons'
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login'
import GoogleLogin, { GoogleLogout } from 'react-google-login'
import useStores from '../../stores'

const ButtonBox = () => {
  const { authStore } = useStores()
  function responseFacebook(response: ReactFacebookLoginInfo) {
    authStore.signup('facebook', {
      access_token: response.accessToken,
    })
  }

  function responseGoogle(response: any) {
    authStore.signup('google', {
      id_token: response.tokenId,
    })
  }

  function onLogoutSuccess() {
    console.log('success')
  }

  return (
    <div className="button-box">
      <span className="signin-google button-item">
        <GooglePlusOutlined />
      </span>
      {/* <GoogleLogin
        clientId={import.meta.env.VITE_GG_CLIENT_ID as string}
        buttonText=""
        onSuccess={responseGoogle}
        cookiePolicy={'single_host_origin'}
        icon={true}
        autoLoad={true}
        className="signin-google button-item"
      ></GoogleLogin>
      <GoogleLogout
        clientId={import.meta.env.VITE_GG_CLIENT_ID as string}
        buttonText="Logout"
        onLogoutSuccess={onLogoutSuccess}
      ></GoogleLogout> */}
      <span className="signin-github button-item">
        <GithubOutlined />
      </span>
      <FacebookLogin
        appId={import.meta.env.VITE_FB_CLIENT_ID as string}
        autoLoad={false}
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
