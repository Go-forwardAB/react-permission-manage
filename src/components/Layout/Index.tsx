import React from 'react'
import { Layout } from 'antd'
import Header from './Header'
import Aside from './Aside'
import TabView from './TabView'
import { Outlet } from 'react-router-dom'

const { Header: AntHeader, Sider, Content } = Layout

const BaseLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AntHeader style={{ backgroundColor: '#a0cfff', padding: 0 }}>
        <Header />
      </AntHeader>

      <Layout>
        <Sider width={200}>
          <Aside />
        </Sider>

        <Content
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
          }}
        >
          <TabView />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default BaseLayout
