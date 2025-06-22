import type { MenuItem } from '@/types/menu'
interface MenuWithButtons extends MenuItem {
  buttons?: MenuItem[]
  children?: MenuWithButtons[]
}

export function filterVisibleMenus(menus: MenuItem[], parentId = 0): MenuItem[] {
  return menus
    .filter((item) => item.parentId === parentId && item.type !== 'button')
    .map((item) => ({
      ...item,
      children: filterVisibleMenus(menus, item.id),
    }))
}

export function attachButtonsToMenus(menus: MenuItem[]): MenuWithButtons[] {
  return menus
    .filter((item) => item.type === 'menu' && item.visible !== false)
    .map((item) => {
      const buttons = menus.filter((btn) => btn.type === 'button' && btn.parentId === item.id)
      return {
        ...item,
        buttons,
      }
    })
}
