import React, { useEffect } from 'react'
import { Tabs, message } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setActiveTab, removeTab } from '@/store/tabSlice'
import './styles/TabView.scss'

const TabView: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = useSelector((state: RootState) => state.tabs.tabs)
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab || '/')

  useEffect(() => {
    const matchedTab = tabs.find((tab) => tab.path === location.pathname)

    if (matchedTab) {
      if (activeTab !== location.pathname) {
        dispatch(setActiveTab(location.pathname))
        navigate(matchedTab.path, { replace: true })
      }
    }
  }, [location.pathname, tabs, dispatch, activeTab, navigate])

  const onChange = (key: string) => {
    dispatch(setActiveTab(key))
    navigate(key)
  }

  const onEdit = (targetKey: string) => {
    if (targetKey === '/dashboard') {
      message.warning('该 Tab 禁止删除')
      return
    }
    dispatch(removeTab(targetKey))
  }

  return (
    <div style={{ background: '#fff' }}>
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeTab}
        onChange={onChange}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEdit={onEdit as any}
        items={tabs.map((tab) => ({
          key: tab.path,
          label: tab.title,
          closable: tab.path !== '/dashboard',
        }))}
      />
    </div>
  )
}

export default TabView
