import Cookies from 'js-cookie'

const TOKEN_KEY_A = 'A_token'
const TOKEN_KEY_R = 'R_token'

export function setTokenA(val: string) {
  Cookies.set(TOKEN_KEY_A, val, {
    expires: 1 / 24, // 1小时 = 1/24天
    path: '/',
    // secure: true, // 生产环境启用 https 时开启
    // sameSite: 'lax',
  })
}

export function setTokenR(val: string) {
  Cookies.set(TOKEN_KEY_R, val, {
    expires: 1 / 24,
    path: '/',
  })
}

export function getTokenA(): string | undefined {
  return Cookies.get(TOKEN_KEY_A)
}

export function getTokenR(): string | undefined {
  return Cookies.get(TOKEN_KEY_R)
}

export function removeTokenA() {
  Cookies.remove(TOKEN_KEY_A, { path: '/' })
}

export function removeTokenR() {
  Cookies.remove(TOKEN_KEY_R, { path: '/' })
}

export function clearAllTokens() {
  removeTokenA()
  removeTokenR()
}
