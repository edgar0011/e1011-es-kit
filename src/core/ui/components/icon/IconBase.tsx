import { CSSProperties, memo, useMemo, PropsWithChildren } from 'react'

import classes from './icon.module.scss'

type IconBaseType = PropsWithChildren<any> & {
  iconUrl?: string
  minWidth?: string
  minHeight?: string
  width?: string
  height?: string
  size?: string
  color?: string
  className?: string
}

export const IconBase = memo<IconBaseType>(({
  iconUrl, minWidth = '1rem', minHeight = '1rem', size, width, height, color = 'currentColor', className = '', children,
}: IconBaseType) => {
  const styles = useMemo(() => (
    {
      '--min-width': minWidth,
      '--min-height': minHeight,
      '--width': size || width,
      '--height': size || height,
      ...(size ? { fontSize: size } : {}),
      ...(iconUrl ? { '--icon-url': `url(${iconUrl})` } : {}),
      ...(iconUrl ? { '--icon-color': color } : { '--icon-content-color': color }),
    }
  ), [minWidth, minHeight, size, width, height, iconUrl, color])

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
