import { Button, type ButtonProps } from 'antd'
import { usePermission } from '@/hooks/usePermission'

interface PermissionButtonProps extends ButtonProps {
  permission: string
  children: React.ReactNode
}

export const PermissionButton = ({
  permission,
  children,
  ...buttonProps
}: PermissionButtonProps) => {
  const hasPermission = usePermission(permission)
  if (!hasPermission) {
    return null
  }

  return <Button {...buttonProps}>{children}</Button>
}
