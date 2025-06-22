import service from '@/utils/axios'
import { type Response } from '@/types/response'
import { type Role } from '@/types/role'

interface RoleResponse extends Response {
  total: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
}

export function rolesList(page: number, pageSize: number, name: string): Promise<RoleResponse> {
  return service.get(`/roles?page=${page}&pageSize=${pageSize}&name=${name}`)
}

export function roleSave(data: Role): Promise<Response> {
  return service.post(`/roleSave`, data)
}

export function roleDelete(data: { id: number }): Promise<Response> {
  return service.post(`/roleDelete`, data)
}

// 重载声明
export function roleMenu(
  roleId: number
): Promise<
  Response & { data: { id: number; roleId: number; menuIds: number[]; buttonIds: number[] } }
>
export function roleMenu(): Promise<
  Response & { data: { id: number; roleId: number; menuIds: number[]; buttonIds: number[] }[] }
>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function roleMenu(roleId?: number): any {
  return service.get(`/roleMenu?roleId=${roleId}`)
}

export function roleMenuUpdate(data: {
  roleId: number
  menuIds: number[]
  buttonIds: number[]
}): Promise<Response> {
  return service.post(`/roleMenuUpdate`, data)
}

export function roleEnabled(data: { id: number; enabled: boolean }): Promise<Response> {
  return service.post(`/roleEnabled`, data)
}
