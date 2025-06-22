import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export function usePermission(permissionKey: string) {
  const btns = useSelector((state: RootState) => state.menu.btns)
  useEffect(() => {
    console.log(btns)
  }, [btns])
  return btns.includes(permissionKey)
}
