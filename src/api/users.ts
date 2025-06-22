import service from '@/utils/axios'
import { type Response } from '@/types/response'
import { type User } from '@/types/user'

interface RoleResponse extends Response {
  total: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
}

export function usersList(page: number, pageSize: number, name: string): Promise<RoleResponse> {
  return service.get(`/users?page=${page}&pageSize=${pageSize}&username=${name}`)
}

export function userSave(data: User): Promise<RoleResponse> {
  return service.post(`/userSave`, data)
}

export function userDelete(data: { id: number }): Promise<RoleResponse> {
  return service.post(`/userDelete`, data)
}

export function userEnabled(data: { id: number; enabled: boolean }): Promise<RoleResponse> {
  return service.post(`/userEnabled`, data)
}
