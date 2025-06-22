import React from 'react'
import * as AntdIcons from '@ant-design/icons'

interface DynamicIconProps {
  name?: string
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name }) => {
  if (!name) return null

  const iconName = name.charAt(0).toUpperCase() + name.slice(1) + 'Outlined'
  const IconComponent = (AntdIcons as unknown as Record<string, React.FC>)?.[iconName]
  if (!IconComponent) return null
  return <IconComponent />
}

export default DynamicIcon
