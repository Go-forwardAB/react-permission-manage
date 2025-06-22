import { PermissionButton } from '@/components/PermissionButton'

const PackTable: React.FC = () => {
  return (
    <div className="pack-table">
      <PermissionButton permission="table:add" type="primary">
        新增
      </PermissionButton>

      <PermissionButton permission="table:del" type="primary" danger>
        删除
      </PermissionButton>

      <PermissionButton permission="table:edit">修改</PermissionButton>

      <PermissionButton permission="table:detail">详情</PermissionButton>
    </div>
  )
}

export default PackTable
