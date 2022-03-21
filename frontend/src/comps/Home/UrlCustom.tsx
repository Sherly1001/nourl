import './urlcustom.scss'
import { customText } from '../../assests/images'
import { CheckOutlined } from '@ant-design/icons'
import CustomForm from './CustomForm'
import ShowUrl from './ShowUrl'
import { useState } from 'react'

const UrlCustom = () => {
  const [showCustomForm, setShowCustomForm] = useState(false)

  return (
    <div className="custom">
      <img src={customText} alt="" />
      <div className="custom-content">
        <CustomForm show={showCustomForm} setShow={setShowCustomForm} />
        <ShowUrl show={showCustomForm} setShow={setShowCustomForm} />
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

export default UrlCustom
