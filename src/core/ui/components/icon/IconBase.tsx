import { CSSProperties, memo, useMemo, PropsWithChildren } from 'react'

import classes from './icon.module.scss'

type IconBaseType = PropsWithChildren<any> & {
  iconUrl?: string
  minWidth?: string
  minHeight?: string
  width?: string
  height?: string
  color?: string
}

export const IconBase = memo<IconBaseType>(({
  iconUrl, minWidth = '1rem', minHeight = '1rem', width, height, color = 'currentColor',
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
    <span className={`${classes['icon-base']} icon-base`} style={styles as CSSProperties} />
  )
})

IconBase.displayName = 'IconBase'
