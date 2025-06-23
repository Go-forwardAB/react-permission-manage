import { logout as _logout } from '@/api/login'
import { resetRouter } from '@/router/dynamic'
import store from '@/store'
import { clearAllTokens } from '@/utils/token'
import { message, Modal } from 'antd'

export function logout() {
  Modal.confirm({
    title: '确定要退出登录吗',
    onOk: async () => {
      const userInfo = store.getState().userInfo
      const res = await _logout({
        userId: userInfo.id!,
      })
      if (res.code === 200) {
        resetRouter()
        handleTokenExpired()
        message.success(res.message)
      }
    },
  })
}

function handleTokenExpired() {
  const rememberedUser = localStorage.getItem('rememberedUser')
  if (rememberedUser) {
    const temp = rememberedUser
    localStorage.clear()
    clearAllTokens()
    localStorage.setItem('rememberedUser', temp)
  } else {
    clearAllTokens()
    localStorage.clear()
  }
  window.location.href = `${import.meta.env.BASE_URL}#/login`
}
