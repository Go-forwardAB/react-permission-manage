import { useNavigate } from 'react-router-dom'
import { Modal, message } from 'antd'
import { logout as _logout } from '@/api/login'
import { logoutRedirect } from '@/utils/logout'
import store from '@/store'

export function useLogout() {
  const navigate = useNavigate()

  const logout = () => {
    Modal.confirm({
      title: '确定要退出登录吗',
      onOk: async () => {
        const userInfo = store.getState().userInfo
        const res = await _logout({ userId: userInfo.id! })
        if (res.code === 200) {
          message.success(res.message)
          logoutRedirect(false)
          navigate('/login', { replace: true })
        }
      },
    })
  }

  return logout
}
