import type { MenuItem } from '@/types/menu'

export function visibleMenus(menus: MenuItem[], parentId = 0): MenuItem[] {
  return menus
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: visibleMenus(menus, item.id).length > 0 ? visibleMenus(menus, item.id) : null,
    }))
    .sort((a, b) => a.order - b.order) as MenuItem[]
}
