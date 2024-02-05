import { CSSProperties, memo, useMemo, FC, PropsWithChildren, MouseEvent } from 'react'

import classes from './icon.module.scss'
import { unifyIconUrl } from './unifyIconUrl'


export type IconBaseType = PropsWithChildren<unknown> & {
  id?: string
  iconUrl?: string
  minWidth?: string
  minHeight?: string
  width?: string
  height?: string
  size?: string
  fontSize?: string
  color?: string
  className?: string
  style?: CSSProperties
  onClick?: (event?: MouseEvent<HTMLSpanElement> | undefined) => void
}

export const IconBase: FC<IconBaseType> = memo<IconBaseType>(({
  iconUrl, minWidth, minHeight, size,
  fontSize, width, height, color = 'currentColor', className = '', children, style, onClick, ...props
}: IconBaseType) => {
  const unifiedIconUrl = iconUrl && unifyIconUrl(iconUrl)

  const styles = useMemo(() => (
    {
      '--min-width': minWidth || size || width || 'auto',
      '--min-height': minHeight || size || height || 'auto',
      '--width': size || width || '1rem',
      '--height': size || height || '1rem',
      ...(fontSize ? { fontSize } : {}),
      ...(unifiedIconUrl ? { '--icon-url': `url(${unifiedIconUrl})` } : {}),
      ...(unifiedIconUrl ? { '--icon-color': color } : { '--icon-content-color': color }),
      ...(onClick ? { cursor: 'pointer' } : {}),
      ...style,
    }
  ), [minWidth, size, width, minHeight, height, fontSize, unifiedIconUrl, color, onClick, style])

  const onClickProps = useMemo(() => (onClick ? ({
    onClick,
    role: 'button',
    tabIndex: -1,
  }) : {}), [onClick])

  return (
    <span
      {...props}
      {...onClickProps}
      className={`${classes['icon-base']} icon-base ${className}`}
      style={styles as CSSProperties}
    >
      {(!unifiedIconUrl && children) && children}
    </span>
  )
})

IconBase.displayName = 'IconBase'
