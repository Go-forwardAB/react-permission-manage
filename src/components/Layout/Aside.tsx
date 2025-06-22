import React, { useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setActiveTab, addTab } from '@/store/tabSlice'
import { filterVisibleMenus } from '@/utils/filterVisibleMenus'
import type { MenuItem } from '@/types/menu'
import DynamicIcon from '@/components/DynamicIcon'

const { Sider } = Layout

interface Item {
  key: string
  icon: React.ReactNode
  label: string
  children?: Item[]
}

const convertMenusToItems = (menus: MenuItem[]): Item[] => {
  return menus.map((menu) => {
    const item: Item = {
      key: menu.path!,
      icon: <DynamicIcon name={menu.icon} />,
      label: menu.title,
    }
    if (menu.children && menu.children.length > 0) {
      item.children = convertMenusToItems(menu.children)
    }
    return item
  })
}

const Aside: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const init_menus = useSelector((state: RootState) => state.menu.init_menus)
  const menuList = filterVisibleMenus(init_menus)
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab || '/')
  const items = convertMenusToItems(menuList)

  useEffect(() => {
    if (activeTab) navigate(activeTab)
  }, [activeTab, navigate])

  const onSelect = ({ key }: { key: string }) => {
    const matchedMenu = init_menus.find((menu) => menu.path === key)
    dispatch(setActiveTab(key))
    if (matchedMenu) {
      dispatch(addTab({ key, title: matchedMenu.title }))
    }
    navigate(key)
  }

  return (
    <Sider width={200}>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[activeTab]}
        onSelect={onSelect}
        items={items}
        style={{
          height: 'calc(100vh - 60px)',
          background: 'linear-gradient(135deg, #001529 0%, #000c17 100%)',
          borderRight: 0,
        }}
      />
    </Sider>
  )
}

export default Aside
