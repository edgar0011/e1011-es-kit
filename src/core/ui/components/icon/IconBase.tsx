import { CSSProperties, memo, useMemo, FC, PropsWithChildren, MouseEvent } from 'react'

import classes from './icon.module.scss'
import { unifyIconUrl } from './unifyIconUrl'


export type IconBaseProps = PropsWithChildren<unknown> & {
  id?: string
  iconUrl?: string | null
  minWidth?: string | null
  minHeight?: string | null
  width?: string | null
  height?: string | null
  size?: string | null
  fontSize?: string | null
  color?: string | null
  className?: string | null
  style?: CSSProperties | null
  onClick?: (event: MouseEvent | KeyboardEvent) => void
}

export const IconBase: FC<IconBaseProps> = memo<IconBaseProps>(({
  iconUrl, minWidth, minHeight, size,
  fontSize, width, height, color = 'currentColor', className = '', children, style, onClick, ...props
}: IconBaseProps) => {
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
