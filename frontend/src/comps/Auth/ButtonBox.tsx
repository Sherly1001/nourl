import './buttonbox.scss'
import {
  GooglePlusOutlined,
  GithubOutlined,
  FacebookOutlined,
} from '@ant-design/icons'
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import useStores from '../../stores'
import { observer } from 'mobx-react-lite'
import { toast } from 'react-toastify'
import LoginGithub from 'react-login-github'
import { gg_client_id, gh_client_id, fb_client_id } from '../../utils/const'
import { go_url } from '../../utils/const'

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

  function responseGithub({ code }: { code: string }) {
    toast.promise(
      authStore.signin('github', {
        code,
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
    toast.promise(
      authStore.signin('google', {
        id_token: response.tokenId,
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

  return (
    <div className="button-box">
      <GoogleLogin
        clientId={gg_client_id as string}
        onSuccess={responseGoogle}
        cookiePolicy={'single_host_origin'}
        className="signin-google button-item"
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className="signin-google button-item"
          >
            <GooglePlusOutlined />
          </button>
        )}
      ></GoogleLogin>
      <LoginGithub
        clientId={gh_client_id}
        className="signin-github button-item"
        onSuccess={responseGithub}
        buttonText={<GithubOutlined />}
        redirectUri={go_url as string}
      />
      <FacebookLogin
        appId={fb_client_id as string}
        fields="name,email,picture"
        callback={responseFacebook}
        cssClass="signin-facebook button-item"
        icon={<FacebookOutlined />}
        textButton=""
        redirectUri={go_url as string}
      />
    </div>
  )
}

export default observer(ButtonBox)
