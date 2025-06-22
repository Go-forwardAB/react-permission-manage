import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, Input, Button, Table, Switch, Pagination, message, Modal, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { User } from '@/types/user'
import { usersList, userDelete, userEnabled } from '@/api/users'
import UserForm, { type UserFormRef } from './components/UserForm'

const UserPage: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [total, setTotal] = useState(0)
  const formRef = useRef<UserFormRef>(null)

  const fetchUsers = useCallback(async () => {
    const res = await usersList(page, pageSize, searchKeyword)
    setUserList(res.data)
    setTotal(res.total)
  }, [page, searchKeyword, pageSize])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onCreate = () => {
    formRef.current?.open()
  }

  const onEdit = (user: User) => {
    formRef.current?.open(user)
  }

  const onSubmitSuccess = () => {
    fetchUsers()
  }

  const onDelete = (user: User) => {
    Modal.confirm({
      title: `确定删除用户 "${user.username}" 吗？`,
      onOk: async () => {
        const res = await userDelete({ id: user.id! })
        message.success(res.message)
        fetchUsers()
      },
    })
  }

  const setEnabled = async (row: User) => {
    try {
      const res = await userEnabled({ id: row.id!, enabled: row.enabled! })
      if (res.code === 200) {
        message.success(res.message)
        fetchUsers()
      } else {
        message.error(res.error)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const columns: ColumnsType<User> = [
    {
      title: '#',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '拥有角色',
      render: (_, row) => (
        <Space wrap>
          {row.roleNames?.map((item) => (
            <Tag key={item.role} color={item.enabled ? 'blue' : 'default'}>
              {item.role}
            </Tag>
          ))}
        </Space>
      ),
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
      width: 180,
      render: (_, row) => (
        <Space>
          <Button size="small" type="primary" onClick={() => onEdit(row)}>
            编辑
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
          placeholder="请输入用户名"
          allowClear
          style={{ width: 200 }}
        />
        <div>
          <Button type="primary" onClick={fetchUsers}>
            搜索
          </Button>
          <Button type="primary" onClick={onCreate} style={{ marginLeft: 8 }}>
            新增用户
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={userList} rowKey="id" pagination={false} />

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      <UserForm ref={formRef} onSuccess={onSubmitSuccess} />
    </Card>
  )
}

export default UserPage
