import { Cascader } from 'antd'
import type { MenuItem } from '@/types/menu'
import { useEffect, useState, useCallback } from 'react'

const MenuCascader = ({
  currentId,
  onChange,
  treeData,
}: {
  currentId?: number
  onChange: (parentId: number) => void
  treeData: MenuItem[]
}) => {
  const [selectedPath, setSelectedPath] = useState<number[]>([])

  const findFullPath = useCallback(
    (targetId: number | undefined, nodes: MenuItem[], path: number[] = []): number[] => {
      if (!targetId) return []
      for (const node of nodes) {
        const currentPath = [...path, node.id]
        if (node.id === targetId) return currentPath
        if (node.children) {
          const found = findFullPath(targetId, node.children, currentPath)
          if (found.length) return found
        }
      }
      return []
    },
    []
  )

  useEffect(() => {
    const path = findFullPath(currentId, treeData)
    setSelectedPath(path)
  }, [currentId, treeData, findFullPath])

  const handleChange = (value: number[], selectedOptions: MenuItem[]) => {
    if (selectedOptions.length > 0) {
      const selectedId = selectedOptions[selectedOptions.length - 1].id
      setSelectedPath(value)
      onChange(selectedId)
    }
  }

  return (
    <Cascader<MenuItem>
      fieldNames={{ value: 'id', label: 'title', children: 'children' }}
      options={treeData}
      onChange={handleChange}
      value={selectedPath}
      placeholder="请选择父级菜单"
      changeOnSelect
      displayRender={(labels) => labels.join(' / ')}
      style={{ width: '100%' }}
    />
  )
}

export default MenuCascader
