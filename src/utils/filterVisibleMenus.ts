import store from '@/store'
import type { MenuItem } from '@/types/menu'

export function filterVisibleMenus(menus: MenuItem[]) {
  const filterMenu: MenuItem[] = store.getState().menu.filterMenu

  const result = filterMenu
    ?.filter((item) => menus.some((sItem: MenuItem) => sItem.id === item.id && sItem.visible))
    .map((item) => ({
      ...item,
      order: menus.find((sItem) => sItem.id === item.id)?.order,
    })) as MenuItem[]
  return getMenus(result!)
}

const getMenus = (menus: MenuItem[], parentId = 0): MenuItem[] => {
  return menus
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: getMenus(menus, item.id).length > 0 ? getMenus(menus, item.id) : null,
    }))
    .sort((a, b) => a.order - b.order) as MenuItem[]
}
