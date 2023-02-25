import { memo } from 'react'

type IconType = {
  icon: {
    prefix: string
    iconName: string
    icon: any[]
  }
  className?: string
  color?: string
}

export const Icon = memo<IconType>(({ icon, className, color = 'currentColor' }: IconType) => (
  <svg
    aria-hidden='true'
    focusable='false'
    data-prefix={icon.prefix}
    data-icon={icon.iconName}
    className={`svg-inline--fa fa-${icon.iconName} ${className}`}
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`}
  >
    <path
      fill={color}
      d={icon.icon[4]}
    />
  </svg>
))

Icon.displayName = 'Icon'
