import { resetRouter } from '@/router/dynamic'
import { clearAllTokens } from '@/utils/token'

export function logoutRedirect(baseRedirect = true) {
  const rememberedUser = localStorage.getItem('rememberedUser')
  if (rememberedUser) {
    const temp = rememberedUser
    clearAllTokens()
    localStorage.setItem('rememberedUser', temp)
  } else {
    clearAllTokens()
  }

  resetRouter()

  if (baseRedirect) {
    window.location.href = '/login'
  }
}
