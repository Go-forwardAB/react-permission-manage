import { useEffect, useState } from 'react'
import { useRoutes, Navigate, type RouteObject } from 'react-router-dom'
import { getTokenA, getTokenR } from '@/utils/token'
import { generateRoutes } from './dynamic'
import Layout from '@/components/Layout/Index'
import LoginPage from '@/views/Login'
import NotFound from '@/views/NotFound'

const defaultRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <Navigate to="/login" replace /> },
]

export default function AppRouter() {
  const [routes, setRoutes] = useState<RouteObject[]>([])
  const hasToken = !!getTokenA() && !!getTokenR()

  useEffect(() => {
    const initRoutes = async () => {
      if (hasToken) {
        const dynamicRoutes = await generateRoutes()

        const authenticatedRoutes: RouteObject[] = [
          {
            path: '/',
            element: <Layout />,
            children: [
              { index: true, element: <Navigate to="/dashboard" replace /> },
              ...dynamicRoutes,
            ],
          },
          { path: '/login', element: <Navigate to="/" replace /> },
          { path: '*', element: <NotFound /> },
        ]
        setRoutes(authenticatedRoutes)
      } else {
        setRoutes([...defaultRoutes])
      }
    }

    initRoutes()
  }, [hasToken])

  const element = useRoutes(routes)
  if (routes.length === 0) return <div>页面加载中...</div>
  return element
}
