import { CSSProperties, memo, useMemo, FC, PropsWithChildren, MouseEvent } from 'react'

import classes from './icon.module.scss'


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
  const styles = useMemo(() => (
    {
      '--min-width': minWidth || size || width || 'auto',
      '--min-height': minHeight || size || height || 'auto',
      '--width': size || width || '1rem',
      '--height': size || height || '1rem',
      ...(fontSize ? { fontSize } : {}),
      ...(iconUrl ? { '--icon-url': `url(${iconUrl})` } : {}),
      ...(iconUrl ? { '--icon-color': color } : { '--icon-content-color': color }),
      ...(onClick ? { cursor: 'pointer' } : {}),
      ...style,
    }
  ), [minWidth, size, width, minHeight, height, fontSize, iconUrl, color, onClick, style])

  const onClickProps = useMemo(() => (onClick ? ({
    onClick,
    onkeyDown: onClick,
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
      {(!iconUrl && children) && children}
    </span>
  )
})

IconBase.displayName = 'IconBase'
