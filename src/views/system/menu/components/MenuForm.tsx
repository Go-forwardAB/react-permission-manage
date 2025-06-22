import { useImperativeHandle, useState, forwardRef } from 'react'
import { Modal, Form, Input, Select, InputNumber, Switch, Radio } from 'antd'
import type { MenuItem } from '@/types/menu'
import { getComponentList } from '@/utils/componentOptions'
import DynamicIcon from '@/components/DynamicIcon'
import MenuCascader from '@/components/MenuCascader'

export interface MenuFormRef {
  open: (data?: MenuItem) => void
  close: () => void
}

interface Props {
  menuTree: MenuItem[]
  onSubmitSuccess: (data: MenuItem) => void
}

const MenuForm = forwardRef<MenuFormRef, Props>(({ menuTree, onSubmitSuccess }, ref) => {
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form] = Form.useForm<MenuItem>()
  const [componentOptions] = useState(() => getComponentList())
  const [currentType, setCurrentType] = useState<'menu' | 'directory' | 'button'>('menu')

  useImperativeHandle(ref, () => ({
    open(data?: MenuItem) {
      setVisible(true)
      if (data) {
        setIsEdit(true)
        form.setFieldsValue(data)
        setCurrentType(data.type)
      } else {
        setIsEdit(false)
        form.resetFields()
        form.setFieldsValue({ type: 'menu', order: 0, visible: true })
        setCurrentType('menu')
      }
    },
    close() {
      setVisible(false)
    },
  }))

  const handleComponentChange = (val: string) => {
    const comp = componentOptions.find((item) => item.element === val)
    if (comp) {
      form.setFieldsValue({
        element: comp.element,
        path: comp.path,
      })
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      values.id = form.getFieldValue('id')
      onSubmitSuccess(values)
      setVisible(false)
    } catch (err) {
      console.log(err)
    }
  }

  const typeLabel = {
    directory: '目录',
    menu: '菜单',
    button: '按钮',
  }

  return (
    <Modal
      title={isEdit ? '编辑菜单' : '新增菜单'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      width={500}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item
          name="title"
          label={`${typeLabel[currentType]}名称`}
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder={`请输入${typeLabel[currentType]}名称`} />
        </Form.Item>

        {currentType !== 'directory' && (
          <Form.Item
            name="parentId"
            label="父级菜单"
            rules={[{ required: true, message: '请选择父级菜单' }]}
          >
            <MenuCascader
              treeData={menuTree}
              currentId={form.getFieldValue('id')}
              onChange={(parentId) => form.setFieldsValue({ parentId })}
            />
          </Form.Item>
        )}

        {currentType === 'menu' && (
          <Form.Item
            name="element"
            label="组件"
            rules={[{ required: true, message: '请选择组件' }]}
          >
            <Select
              showSearch
              placeholder="请选择组件"
              onChange={handleComponentChange}
              options={componentOptions.map((item) => ({
                label: item.element,
                value: item.element,
              }))}
            />
          </Form.Item>
        )}

        {currentType !== 'button' && (
          <>
            <Form.Item
              name="path"
              label="路由地址"
              rules={[{ required: true, message: '请输入路由地址' }]}
            >
              <Input readOnly={currentType === 'menu'} placeholder="请输入路由地址" />
            </Form.Item>

            <Form.Item name="icon" label="图标" rules={[{ required: true, message: '请选择图标' }]}>
              <Select placeholder="请选择图标">
                {[
                  { label: '设置', value: 'Setting' },
                  { label: '菜单', value: 'Appstore' },
                  { label: '首页', value: 'Home' },
                  { label: '记事本', value: 'FileText' },
                ].map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <DynamicIcon name={item.value} />
                      {item.label}
                    </span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}

        {currentType === 'button' && (
          <Form.Item
            name="code"
            label="按钮标识"
            rules={[{ required: true, message: '请输入按钮标识' }]}
          >
            <Input placeholder="请输入按钮标识，如：user:add" />
          </Form.Item>
        )}

        <Form.Item name="type" label="类型" rules={[{ required: true }]}>
          <Radio.Group onChange={(e) => setCurrentType(e.target.value)} value={currentType}>
            <Radio value="directory">目录</Radio>
            <Radio value="menu">菜单</Radio>
            <Radio value="button">按钮</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="order" label="排序" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        {currentType !== 'button' && (
          <Form.Item name="visible" label="是否显示" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
})

export default MenuForm
