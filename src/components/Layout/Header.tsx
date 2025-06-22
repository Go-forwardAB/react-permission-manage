import React from 'react'
import { Button } from 'antd'
import { PoweroffOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { logout } from '@/utils/logout'
import './styles/Header.scss'

const Header: React.FC = () => {
  const username = useSelector((state: RootState) => state.userInfo.username)

  return (
    <nav className="header-nav">
      <h3 className="title">REACT-PERMISSION-MANAGE</h3>

      <div>
        <span className="username">{username}</span>

        <Button
          type="primary"
          shape="circle"
          icon={<PoweroffOutlined />}
          onClick={logout}
          className="ml-4"
        />
      </div>
    </nav>
  )
}

export default Header
