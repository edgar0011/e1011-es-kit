/* eslint-disable react/jsx-props-no-spreading */
import { memo, FC } from 'react'
import styled from 'styled-components'

const lineGrayColor = '#999999'

type DividerProps = {
  orientation?: string
  margin?: string
  vertical?: boolean
  horizontal?: boolean
  length?: string
  color?: string
  opacity?: number
  left?: string
  width?: string
  height?: string
}

export const DividerLine: FC<DividerProps> = memo(styled(({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orientation, vertical, horizontal, length, color, opacity, zIndex, width, height, ...rest
}) => <div {...rest} />)<DividerProps>`
  position:relative;
  display:block;
  ${({
    orientation, vertical, margin,
    length = '80%', left = '0', width = '1px', height = '1px' }) => (orientation === 'vertical' || vertical
    ? `
      height: ${length};
      left: ${left};
      width: ${width};
      margin: ${margin || 'auto 0'};`
    : `
      width: ${length};
      left: ${left};
      height: ${height};
      margin: ${margin || '0 auto'};`)
};
  transition: opacity, width, height 250ms ease-in-out;
  background-color: ${({ color }) => color || lineGrayColor};
  opacity: ${({ opacity = 1 }) => opacity};
`)

export const DividerVertical: FC<DividerProps>
  = memo((props) => <DividerLine vertical length='100%' {...props} />)
DividerVertical.displayName = 'DividerVertical'

export const DividerHorizontal: FC<DividerProps>
  = memo((props) => <DividerLine horizontal length='100%' {...props} />)
DividerHorizontal.displayName = 'DividerHorizontal'
