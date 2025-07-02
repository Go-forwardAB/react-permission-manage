import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export function usePermission(permissionKey: string) {
  const btns = useSelector((state: RootState) => state.menu.btns)
  return btns.includes(permissionKey)
}
