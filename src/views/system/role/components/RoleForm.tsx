import { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal, Form, Input, Switch, message } from 'antd'
import type { Role } from '@/types/role'
import { roleSave } from '@/api/roles'

interface RoleFormProps {
  onSuccess?: () => void
}

export interface RoleFormRef {
  open: (role?: Role) => void
}

const RoleForm = forwardRef<RoleFormRef, RoleFormProps>(({ onSuccess }, ref) => {
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form] = Form.useForm<Role>()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const open = (role?: Role) => {
    setIsEdit(!!role)
    form.resetFields()
    if (role) {
      form.setFieldsValue(role)
    } else {
      form.setFieldsValue({
        name: '',
        code: '',
        description: '',
        enabled: true,
      })
    }
    setVisible(true)
  }

  const handleClose = () => {
    form.resetFields()
    setVisible(false)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      const res = await roleSave({
        ...values,
        id: form.getFieldValue('id'),
      })
      if (res.code === 200) {
        message.success(res.message)
        setVisible(false)
        onSuccess?.()
      } else {
        message.error(res.error)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setConfirmLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    open,
  }))

  return (
    <Modal
      title={isEdit ? '编辑角色' : '新增角色'}
      open={visible}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          name="code"
          label="角色编码"
          rules={[{ required: true, message: '请输入角色编码' }]}
        >
          <Input placeholder="请输入角色编码，如：admin" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="enabled" label="是否启用" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default RoleForm
