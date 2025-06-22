import { Cascader } from 'antd'
import type { MenuItem } from '@/types/menu'

const MenuCascader = ({
  currentId,
  onChange,
  treeData,
}: {
  currentId?: number
  onChange: (parentId: number) => void
  treeData: MenuItem[]
}) => {
  const findFullPath = (
    targetId: number | undefined,
    nodes: MenuItem[],
    path: number[] = []
  ): number[] | undefined => {
    if (!targetId) return undefined

    for (const node of nodes) {
      const currentPath = [...path, node.id]
      if (node.id === targetId) {
        return currentPath
      }
      if (node.children) {
        const found = findFullPath(targetId, node.children, currentPath)
        if (found) return found
      }
    }
    return undefined
  }

  const currentPath = findFullPath(currentId, treeData)

  return (
    <Cascader<MenuItem>
      fieldNames={{ value: 'id', label: 'title', children: 'children' }}
      options={treeData}
      onChange={(_, selectedNodes) => {
        onChange(selectedNodes[selectedNodes.length - 1].id)
      }}
      value={currentPath}
      placeholder="请选择父级菜单"
      changeOnSelect
      displayRender={(labels) => labels.join(' / ')}
      style={{ width: '100%' }}
    />
  )
}

export default MenuCascader
