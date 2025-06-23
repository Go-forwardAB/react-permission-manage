import { resetRouter } from '@/router/dynamic'
import { clearAllTokens } from '@/utils/token'

export function logoutRedirect(baseRedirect = true) {
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

  resetRouter()

  if (baseRedirect) {
    window.location.href = `${location.origin}/react-permission-manage/#/login`
  }
}
