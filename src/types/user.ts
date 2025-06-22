export interface User {
  id?: number
  username: string
  password: string
  nickname: string
  roleIds: number[]
  isLoaded: boolean
  roleNames?: { role: string; enabled: boolean }[] // 展示用
  enabled?: boolean // 1 启用，0 禁用
}
