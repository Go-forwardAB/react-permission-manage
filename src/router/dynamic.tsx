import React, { lazy, Suspense } from 'react'
import { Navigate, Outlet, type RouteObject } from 'react-router-dom'
import store from '@/store'
import { getRoleList, getRoleMenu } from '@/store/roleSlice'
import { getMenuList, setFilterMenu, setFilterButton } from '@/store/menuSlice'
import { setTabs } from '@/store/tabSlice'
import type { MenuItem } from '@/types/menu'
import type { RoleMenu } from '@/types/roleMenu'
import type { Role } from '@/types/role'

let cachedRoutes: RouteObject[] = []
console.log(cachedRoutes)

export async function generateRoutes(): Promise<RouteObject[]> {
  const { userInfo, tabs } = store.getState()
  const roleR = await store.dispatch(getRoleList())
  const allRoles = roleR.payload as Role[]
  const userRoles = allRoles.filter((r) => userInfo.roleIds.includes(r.id!) && r.enabled)

  const roleMenusR = await store.dispatch(getRoleMenu())
  const allRoleMenus = roleMenusR.payload as RoleMenu[]
  const menuIdSet = new Set<number>()
  const buttonIdSet = new Set<number>()
  userRoles?.forEach((role) => {
    const roleMenu = allRoleMenus.find((rm) => rm.roleId === role.id)
    roleMenu?.menuIds?.forEach((id: number) => menuIdSet.add(id))
    roleMenu?.buttonIds?.forEach((id: number) => buttonIdSet.add(id))
  })

  const menusR = await store.dispatch(getMenuList())
  const allMenus = menusR.payload as MenuItem[]
  const accessMenus = allMenus.filter(
    (m) => menuIdSet.has(m.id) && m.type !== 'button' && m.visible
  )
  const accessBtns = allMenus
    .filter((m) => buttonIdSet.has(m.id) && m.type == 'button')
    .map((item) => item.id)

  const filterTabs = tabs.tabs.filter((item) =>
    accessMenus.some((sItem) => item.path === sItem.path)
  )

  store.dispatch(setTabs(filterTabs))
  store.dispatch(setFilterMenu(accessMenus))
  store.dispatch(setFilterButton(accessBtns))

  const processedMenus = preprocessMenuPaths(accessMenus)
  const routeTree = buildRoutesTree(processedMenus)

  cachedRoutes = routeTree
  return routeTree
}

function preprocessMenuPaths(menus: MenuItem[]): MenuItem[] {
  return menus.map((menu) => {
    const parts = menu.path?.split('/').filter(Boolean) ?? []
    return {
      ...menu,
      path: parts[parts.length - 1] || '',
    }
  })
}

function buildRoutesTree(menus: MenuItem[]): RouteObject[] {
  const routeMap = new Map<number, RouteObject>()
  const modules = import.meta.glob('@/views/**/*.tsx')
  const roots: RouteObject[] = []

  const EmptyLayout = () => (
    <Suspense fallback={<div>加载中...</div>}>
      <Outlet />
    </Suspense>
  )

  menus.forEach((menu) => {
    const elementPath = `/src/views/${menu.element}`
    const hasChildren = menus.some((m) => m.parentId === menu.id)
    let element: React.ReactNode

    if (hasChildren) {
      element = <EmptyLayout />
    } else {
      const LazyComp = lazy(
        () =>
          modules[elementPath]() as Promise<{
            default: React.ComponentType<unknown>
          }>
      )
      element = (
        <Suspense fallback={<div>加载中...</div>}>
          <LazyComp />
        </Suspense>
      )
    }

    const route: RouteObject = {
      path: menu.path!,
      element,
      children: [],
    }

    routeMap.set(menu.id, route)

    if (menu.parentId && routeMap.has(menu.parentId)) {
      routeMap.get(menu.parentId)!.children!.push(route)
    } else {
      roots.push(route)
    }
  })

  function addRedirects(routes: RouteObject[], basePath = '') {
    routes.forEach((route) => {
      const fullPath = basePath
        ? `${basePath}/${route.path}`.replace(/\/+/g, '/')
        : `/${route.path}`
      if (route.children && route.children.length > 0) {
        const firstChild = route.children[0]
        if (firstChild.path && !route.children?.some((r) => r.index)) {
          route.children.unshift({
            index: true,
            element: <Navigate to={firstChild.path} replace />,
          })
        }
        addRedirects(route.children, fullPath)
      }
    })
  }

  addRedirects(roots)
  return roots
}

export function resetRouter() {
  cachedRoutes = []
}
