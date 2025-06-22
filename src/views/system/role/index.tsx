import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, Input, Button, Table, Switch, Pagination, message, Modal, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Role } from '@/types/role'
import { rolesList, roleDelete, roleEnabled } from '@/api/roles'
import RoleForm, { type RoleFormRef } from './components/RoleForm'
import Permission from './components/Permission'

const RolePage: React.FC = () => {
  const [roleList, setRoleList] = useState<Role[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [total, setTotal] = useState(0)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0)
  const formRef = useRef<RoleFormRef>(null)

  const fetchRoles = useCallback(async () => {
    const res = await rolesList(page, pageSize, searchKeyword)
    setRoleList(res.data)
    setTotal(res.total)
  }, [page, searchKeyword, pageSize])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onCreate = () => {
    formRef.current?.open()
  }

  const onEdit = (role: Role) => {
    formRef.current?.open(role)
  }

  const onSubmitSuccess = () => {
    fetchRoles()
  }

  const onAssignPermission = (id: number) => {
    setSelectedRoleId(id)
    setDialogVisible(true)
  }

  const onDelete = (role: Role) => {
    Modal.confirm({
      title: `确定删除角色 "${role.name}" 吗？`,
      onOk: async () => {
        const res = await roleDelete({ id: role.id! })
        message.success(res.message)
        fetchRoles()
      },
    })
  }

  const setEnabled = async (row: Role) => {
    try {
      const res = await roleEnabled({ id: row.id!, enabled: row.enabled! })
      if (res.code === 200) {
        message.success(res.message)
        fetchRoles()
      } else {
        message.error(res.error)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const columns: ColumnsType<Role> = [
    {
      title: '#',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
    },
    {
      title: '是否启用',
      width: 100,
      render: (_, row) => (
        <Switch
          checked={row.enabled}
          onChange={(checked) => {
            row.enabled = checked
            setEnabled(row)
          }}
        />
      ),
    },
    {
      title: '操作',
      width: 240,
      render: (_, row) => (
        <Space>
          <Button size="small" type="primary" onClick={() => onEdit(row)}>
            编辑
          </Button>
          <Button size="small" onClick={() => onAssignPermission(row.id!)}>
            分配权限
          </Button>
          <Button size="small" type="primary" danger onClick={() => onDelete(row)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="请输入角色名称"
          allowClear
          style={{ width: 200 }}
        />
        <div>
          <Button type="primary" onClick={fetchRoles}>
            搜索
          </Button>
          <Button type="primary" onClick={onCreate} style={{ marginLeft: 8 }}>
            新增角色
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={roleList} rowKey="id" pagination={false} />

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      <RoleForm ref={formRef} onSuccess={onSubmitSuccess} />
      <Permission
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        roleId={selectedRoleId}
      />
    </Card>
  )
}

export default RolePage
