import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Tab {
  name?: string
  title: string
  path: string
}

interface TabsState {
  tabs: Tab[]
  activeTab: string
}

const defaultTabs = [{ title: '首页', name: 'Home', path: '/dashboard' }]

const initialState: TabsState = {
  tabs: defaultTabs,
  activeTab: '/dashboard',
}

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab(state, action: PayloadAction<{ key: string; title: string }>) {
      const { key, title } = action.payload
      const exists = state.tabs.find((tab) => tab.path === key)
      if (!exists) {
        state.tabs.push({
          title,
          path: key,
        })
      }
      state.activeTab = key
    },
    removeTab(state, action: PayloadAction<string>) {
      const path = action.payload
      state.tabs = state.tabs.filter((tab) => tab.path !== path)
      if (state.activeTab === path) {
        state.activeTab = state.tabs.length > 0 ? state.tabs[state.tabs.length - 1].path : ''
      }
    },
    resetTabs(state) {
      state.tabs = defaultTabs
      state.activeTab = '/dashboard'
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload
    },
  },
})

export const { addTab, removeTab, resetTabs, setActiveTab } = tabsSlice.actions
export default tabsSlice.reducer
