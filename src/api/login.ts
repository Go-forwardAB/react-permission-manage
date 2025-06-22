import service from '@/utils/axios'
import { type Response } from '@/types/response'

interface LoginParams {
  username: string
  password: string
}

interface LoginResponse extends Response {
  data: {
    accessToken: string
    refreshToken: string
    user: {
      username: string
      enabled: boolean
    }
  }
}

export function login(data: LoginParams): Promise<LoginResponse> {
  return service.post('/login', data)
}

export function logout(data: { userId: number }): Promise<Response> {
  return service.post('/logout', data)
}
