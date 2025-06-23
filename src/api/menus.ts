import service from '@/utils/axios'
import { type Response } from '@/types/response'
import { type MenuItem } from '@/types/menu'

interface menusListResponse extends Response {
  data: MenuItem[]
}

export function menusList(): Promise<menusListResponse> {
  return service.get(`/menusList`)
}

export function addMenu(data: MenuItem): Promise<Response> {
  return service.post(`/menuAdd`, data)
}

export function deleteMenu(id: number): Promise<Response & { deletedPaths: string[] }> {
  return service.get(`/menuDelete/${id}`)
}

export function updateMenu(data: MenuItem): Promise<Response> {
  return service.post(`/menuUpdate`, data)
}

export function setMenuVisible(data: { id: number; visible: boolean }): Promise<Response> {
  return service.post(`/setMenuVisible`, data)
}
