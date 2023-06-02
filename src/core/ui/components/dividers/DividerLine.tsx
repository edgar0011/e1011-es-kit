/* eslint-disable react/jsx-props-no-spreading */
import { memo, FC, CSSProperties, useMemo } from 'react'

import classes from './divider.module.scss'


type DividerProps = {
  orientation?: string
  margin?: string
  vertical?: boolean
  length?: string
  color?: string
  opacity?: number
  left?: string
  width?: string
  height?: string
  className?: string
}

export const DividerLine: FC<DividerProps> = memo<DividerProps>(({
  orientation, vertical,
  color = '#999999',
  opacity,
  length = '80%', left = '0',
  width = '1px', height = '1px',
  margin,
  className = '',
}: DividerProps) => {
  const isVertical = useMemo(() => orientation === 'vertical' || vertical === true, [orientation, vertical])

  const styles = useMemo(() => (
    {
      '--width': width,
      '--height': height,
      '--length': length,
      '--opacity': opacity,
      '--color': color,
      '--left': left,
      '--margin': margin || (isVertical ? 'auto 0' : '0 auto'),
    }
  ), [width, height, length, opacity, color, left, margin, isVertical])

  const verHorClass = isVertical ? classes.vertical : classes.horizontal

  return (
    <div
      className={`${(classes as any)['divider-line']} ${verHorClass} ${className}`}
      style={styles as CSSProperties}
    />
  )
})

DividerLine.displayName = 'DividerLine'

export const DividerVertical: FC<DividerProps>
  = memo((props) => <DividerLine vertical length='100%' {...props} />)
DividerVertical.displayName = 'DividerVertical'

export const DividerHorizontal: FC<DividerProps>
  = memo((props) => <DividerLine length='100%' {...props} />)
DividerHorizontal.displayName = 'DividerHorizontal'
