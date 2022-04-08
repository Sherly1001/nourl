import './user-profile.scss'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import LinkCustom from '../Header/LinkCustom'
import { Route, Routes } from 'react-router-dom'
import UserInfo from './UserInfo'
import ChangePasswd from './ChangePasswd'

const UserProfile = () => {
  return (
    <div className="profile">
      <div className="profile-box">
        <div className="profile-tab">
          <h2>User Profile</h2>
          <LinkCustom to="edit" className="tab-item">
            <UserOutlined />
            Edit profile
          </LinkCustom>
          <LinkCustom to="change" className="tab-item">
            <KeyOutlined />
            Change password
          </LinkCustom>
        </div>
        <div className="profile-right">
          <Routes>
            <Route path="/edit" element={<UserInfo />} />
            <Route path="/change" element={<ChangePasswd />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default observer(UserProfile)
