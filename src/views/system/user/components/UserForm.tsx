import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Form, Input, Select, Switch, Modal, message } from 'antd'
import { userSave } from '@/api/users'
import { rolesList } from '@/api/roles'
import type { User } from '@/types/user'
import type { Role } from '@/types/role'

const { Option } = Select

export interface UserFormRef {
  open: (user?: User) => void
}

interface UserFormProps {
  onSuccess: () => void
}

const UserForm = forwardRef<UserFormRef, UserFormProps>(({ onSuccess }, ref) => {
  const [form] = Form.useForm<User>()
  const [visible, setVisible] = useState(false)
  const [roleOptions, setRoleOptions] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    open: (user?: User) => {
      form.resetFields()
      if (user) {
        form.setFieldsValue({
          ...user,
          roleIds: user.roleIds?.map((role) => role) || [],
        })
      } else {
        form.setFieldsValue({
          enabled: true,
          roleIds: [],
        })
      }
      setVisible(true)
    },
  }))

  useEffect(() => {
    if (visible) {
      loadRoles()
    }
  }, [visible])

  const loadRoles = async () => {
    const res = await rolesList(1, 9999, '')
    setRoleOptions(res.data)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      const res = await userSave(values)
      if (res.code === 200) {
        message.success(res.message)
        setVisible(false)
        onSuccess()
      } else {
        message.error(res.message || '保存失败')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={form.getFieldValue('id') ? '编辑用户' : '新增用户'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={500}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ span: 5 }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: !form.getFieldValue('id'), message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          name="roleIds"
          label="分配角色"
          rules={[{ required: true, message: '请至少选择一个角色' }]}
        >
          <Select mode="multiple" placeholder="请选择角色" showSearch optionFilterProp="label">
            {roleOptions.map((role) => (
              <Option key={role.id} value={role.id!} label={role.name}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="enabled" label="是否启用" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default UserForm
