import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Modal, Tabs, Tree, Checkbox, message, type TabsProps } from 'antd'
import { roleMenu, roleMenuUpdate } from '@/api/roles'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { attachButtonsToMenus, filterVisibleMenus } from '../utils'
import { generateRoutes } from '@/router/dynamic'

interface PermissionProps {
  visible: boolean
  onClose: () => void
  roleId: number
}
type TreeRefType = React.ComponentRef<typeof Tree>

const Permission: React.FC<PermissionProps> = ({ visible, onClose, roleId }) => {
  const [activeTab, setActiveTab] = useState('menu')
  const [checkedMenuIds, setCheckedMenuIds] = useState<number[]>([])
  const [checkedButtonIds, setCheckedButtonIds] = useState<number[]>([])
  const treeRef = useRef<TreeRefType>(null)
  const init_menus = useSelector((state: RootState) => state.menu.init_menus)

  const menuTree = useMemo(() => filterVisibleMenus(init_menus, 0), [init_menus])
  const menuWithButtons = useMemo(() => attachButtonsToMenus(init_menus), [init_menus])

  const loadMenus = useCallback(async () => {
    try {
      const res = await roleMenu(roleId)
      setCheckedMenuIds(res.data.menuIds)
      setCheckedButtonIds(res.data.buttonIds)
    } catch (error) {
      console.error('加载权限失败:', error)
    }
  }, [roleId])

  const handleSave = async () => {
    try {
      const checkedMenusFromTree = (treeRef.current?.state.checkedKeys as number[]) || []

      const res = await roleMenuUpdate({
        roleId,
        menuIds: Array.from(checkedMenusFromTree),
        buttonIds: Array.from(checkedButtonIds),
      })

      if (res.code === 200) {
        message.success(res.message)
        generateRoutes()
        onClose()
      } else {
        message.error(res.error)
      }
    } catch (err) {
      console.error('保存权限失败:', err)
      message.error('保存权限失败')
    }
  }

  useEffect(() => {
    if (visible && roleId) {
      loadMenus()
    }
  }, [visible, roleId, loadMenus])

  const items: TabsProps['items'] = [
    {
      key: 'menu',
      label: '菜单权限',
      children: (
        <Tree
          ref={treeRef}
          checkable
          treeData={menuTree}
          fieldNames={{ title: 'title', key: 'id', children: 'children' }}
          checkedKeys={checkedMenuIds}
          onCheck={(checkedKeys) => {
            setCheckedMenuIds(checkedKeys as number[])
          }}
          style={{
            maxHeight: 600,
            overflowY: 'auto',
            padding: 10,
            border: '1px solid #f0f0f0',
            borderRadius: 6,
          }}
        />
      ),
    },
    {
      key: 'button',
      label: '按钮权限',
      children: (
        <>
          {menuWithButtons.map((menu) => (
            <div key={menu.id} style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
              <div style={{ fontWeight: 'bold', marginRight: '20px' }}>{menu.title}</div>
              <Checkbox.Group
                value={checkedButtonIds}
                onChange={(values) => setCheckedButtonIds(values as number[])}
                options={menu.buttons?.map((btn) => ({
                  label: btn.title,
                  value: btn.id,
                }))}
              />
            </div>
          ))}
        </>
      ),
    },
  ]

  return (
    <Modal
      title="分配权限"
      open={visible}
      width={600}
      onCancel={onClose}
      onOk={handleSave}
      maskClosable={false}
      destroyOnHidden
    >
      <Tabs items={items} activeKey={activeTab} onChange={setActiveTab} />
    </Modal>
  )
}

export default Permission
