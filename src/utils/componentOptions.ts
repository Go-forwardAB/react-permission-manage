import type { ComponentType } from 'react'

export interface PageComponentInfo {
  path: string
  element: string
}

const modules = import.meta.glob<{ default: ComponentType<string> }>('/src/views/**/*.tsx', {
  eager: true,
})

export function getComponentList(): PageComponentInfo[] {
  return Object.entries(modules)
    .filter(
      ([path]) =>
        !path.includes('/components/') &&
        !path.includes('/utils/') &&
        !path.includes('Login') &&
        !path.includes('NotFound')
    )
    .map(([path]) => {
      const element = path.replace(/^\/src\/views\//, '')
      const routePath = generateRoutePath(element).toLowerCase()
      return {
        path: routePath,
        element,
      }
    })
}

function generateRoutePath(path: string): string {
  return !path.includes('Home')
    ? '/' + path.replace(/\.tsx$/, '').replace(/\/index$/, '')
    : '/dashboard'
}
