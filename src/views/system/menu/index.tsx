import { useEffect, useRef, useState, useMemo } from 'react'
import { Button, Input, Table, Switch, Tag, Modal, message, Card, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import { deleteMenu, setMenuVisible, addMenu, updateMenu } from '@/api/menus'
import type { MenuItem } from '@/types/menu'
import MenuForm, { type MenuFormRef } from './components/MenuForm'
import type { RootState } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getMenuList } from '@/store/menuSlice'
import DynamicIcon from '@/components/DynamicIcon'

interface TypeConfig {
  label: string
  color: string
}

const typeMap: Record<'directory' | 'menu' | 'button', TypeConfig> = {
  directory: { label: '目录', color: 'blue' },
  menu: { label: '菜单', color: 'green' },
  button: { label: '按钮', color: 'orange' },
}

function filterMenus(data: MenuItem[], keyword: string): MenuItem[] {
  const lowerKeyword = keyword.toLowerCase()
  return data
    .map((item) => {
      const match =
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.path?.toLowerCase().includes(lowerKeyword)
      const children = item.children ? filterMenus(item.children, keyword) : null
      if (match || (children && children.length > 0)) {
        return { ...item, children }
      }
      return null
    })
    .filter(Boolean) as MenuItem[]
}

const MenuManage: React.FC = () => {
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const formRef = useRef<MenuFormRef>(null)
  const dispatch = useAppDispatch()
  const menus = useAppSelector((state: RootState) => state.menu.menus)

  useEffect(() => {
    setMenuList(menus)
  }, [menus])

  const filteredMenus = useMemo(
    () => filterMenus(menuList, searchKeyword),
    [menuList, searchKeyword]
  )

  const columns: ColumnsType<MenuItem> = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
      width: 180,
    },
    {
      title: '路径/按钮标识',
      key: 'pathOrCode',
      render: (_, row) => (row.type === 'button' ? row.code : row.path),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: (icon) =>
        icon ? <DynamicIcon name={icon} /> : <span style={{ color: '#aaa' }}>/</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: 'directory' | 'menu' | 'button') => (
        <Tag color={typeMap[type].color}>{typeMap[type].label}</Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
    },
    {
      title: '显示',
      dataIndex: 'visible',
      key: 'visible',
      width: 100,
      render: (_, row) => (
        <Switch
          checked={row.visible}
          disabled={row.type === 'button' || row.disabled === false}
          onChange={() => toggleVisible(row)}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, row) => (
        <Space>
          <Button size="small" type="primary" onClick={() => handleEdit(row)}>
            编辑
          </Button>
          <Button size="small" danger onClick={() => handleDelete(row.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (row: MenuItem) => {
    formRef.current?.open(row)
  }

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除该菜单？',
      onOk: async () => {
        const res = await deleteMenu(id)
        message.success(res.message)
        dispatch(getMenuList())
      },
    })
  }

  const toggleVisible = async (row: MenuItem) => {
    const res = await setMenuVisible({ id: row.id, visible: !row.visible })
    if (res.code === 200) {
      message.success(res.message)
      dispatch(getMenuList())
    } else {
      message.error('请求失败')
    }
  }

  const handleSubmitSuccess = async (data: MenuItem) => {
    try {
      const res = data.id ? await updateMenu(data) : await addMenu(data)
      if (res.code === 200) {
        message.success(res.message)
        formRef.current?.close()
        dispatch(getMenuList())
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="menu-manage">
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Input
            style={{ width: 240 }}
            placeholder="请输入菜单名称或路径"
            prefix={<SearchOutlined />}
            allowClear
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button type="primary" onClick={() => formRef.current?.open()}>
            新增菜单
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredMenus}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>
      <MenuForm ref={formRef} menuTree={menuList} onSubmitSuccess={handleSubmitSuccess} />
    </div>
  )
}

export default MenuManage
