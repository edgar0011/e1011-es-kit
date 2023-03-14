import { CSSProperties, memo, useMemo, PropsWithChildren } from 'react'

import classes from './icon.module.scss'

export type IconBaseType = PropsWithChildren<any> & {
  iconUrl?: string
  minWidth?: string
  minHeight?: string
  width?: string
  height?: string
  size?: string
  fontSize?: string
  color?: string
  className?: string
}

export const IconBase = memo<IconBaseType>(({
  iconUrl, minWidth, minHeight, size,
  fontSize, width, height, color = 'currentColor', className = '', children, style,
}: IconBaseType) => {
  const styles = useMemo(() => (
    {
      '--min-width': minWidth || size || width || 'auto',
      '--min-height': minHeight || size || height || 'auto',
      '--width': size || width,
      '--height': size || height,
      ...(fontSize ? { fontSize } : {}),
      ...(iconUrl ? { '--icon-url': `url(${iconUrl})` } : {}),
      ...(iconUrl ? { '--icon-color': color } : { '--icon-content-color': color }),
      ...style,
    }
  ), [minWidth, size, width, minHeight, height, fontSize, iconUrl, color, style])

  return (
    <span
      className={`${(classes as any)['icon-base']} icon-base ${className}`}
      style={styles as CSSProperties}
    >
      {(!iconUrl && children) && children}
    </span>
  )
})

IconBase.displayName = 'IconBase'
