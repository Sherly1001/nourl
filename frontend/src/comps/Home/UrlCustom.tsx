import './urlcustom.scss'
import { textHeader } from '../../assests/images'
import { CheckOutlined } from '@ant-design/icons'
import CustomForm from './CustomForm'
import { observer } from 'mobx-react-lite'

const UrlCustom = () => {
  return (
    <div className="custom">
      <img src={textHeader} alt="" />
      <div className="custom-content">
        <CustomForm />
        <div className="custom-desc">
          <ul className="feature">
            <li>
              <CheckOutlined />
              Easy Link Shorting
            </li>
            <li>
              <CheckOutlined />
              Full Link History
            </li>
            <li>
              <CheckOutlined />
              Customized URLs
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default observer(UrlCustom)
