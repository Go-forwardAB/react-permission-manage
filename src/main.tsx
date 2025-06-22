import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'
import './index.css'
import App from './App.tsx'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'

dayjs.locale('zh-cn')

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={<div>加载中...</div>} persistor={persistor}>
      <StrictMode>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </StrictMode>
    </PersistGate>
  </Provider>
)
