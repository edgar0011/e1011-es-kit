import { CSSProperties, memo, useMemo, PropsWithChildren } from 'react'

import classes from './icon.module.scss'

type IconBaseType = PropsWithChildren<any> & {
  iconUrl?: string
  minWidth?: string
  minHeight?: string
  width?: string
  height?: string
  color?: string
  className?: string
}

export const IconBase = memo<IconBaseType>(({
  iconUrl, minWidth = '1rem', minHeight = '1rem', width, height, color = 'currentColor', className,
}: IconBaseType) => {
  const styles = useMemo(() => (
    {
      '--min-width': minWidth,
      '--min-height': minHeight,
      '--width': width,
      '--height': height,
      '--icon-url': `url(${iconUrl})`,
      '--icon-color': color,
    }
  ), [minWidth, minHeight, width, height, iconUrl, color])

  return (
    <span
      className={`${(classes as any)['icon-base']} icon-base ${className}`}
      style={styles as CSSProperties}
    />
  )
})

IconBase.displayName = 'IconBase'
