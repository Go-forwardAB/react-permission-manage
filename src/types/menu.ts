export interface MenuItem {
  id: number
  title: string
  name?: string
  component?: string
  path?: string
  type: 'directory' | 'menu' | 'button'
  icon?: string
  parentId: number
  order: number
  visible?: boolean
  children?: MenuItem[] | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
