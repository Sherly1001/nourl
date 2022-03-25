import './buttonbox.scss'
import {
  GooglePlusOutlined,
  GithubOutlined,
  FacebookOutlined,
} from '@ant-design/icons'
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login'
import GoogleLogin, { GoogleLogout } from 'react-google-login'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'
import { toast } from 'react-toastify'

const ButtonBox = () => {
  const { authStore, appStore } = useStores()
  function responseFacebook(response: ReactFacebookLoginInfo) {
    toast.promise(
      authStore.signin('facebook', {
        access_token: response.accessToken,
      }),
      {
        pending: 'Signing up...',
        success: {
          render() {
            appStore.setSigninModalVisible(false)
            appStore.setSignupModalVisible(false)
            return 'Signin success'
          },
        },
        error: {
          render({ data }: any) {
            return `Signin failed: ${data!.response.data.msg}`
          },
        },
      }
    )
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

export default observer(ButtonBox)
