import React, { memo, FC } from 'react'
import styled from 'styled-components'

type DividerProps = {
  orientation?: string
  margin?: string
  vertical?: boolean
  horizontal?: boolean
  length?: string
  color?: string
  opacity?: number
  left?: string
  zIndex?: number
}

export const DividerLine: FC<DividerProps> = memo(styled(({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orientation, vertical, horizontal, length, color, opacity, zIndex,
  // eslint-disable-next-line react/jsx-props-no-spreading
  ...rest }) => <div {...rest} />)<DividerProps>`
  position:relative;
  display:block;
  ${({ orientation, vertical, margin, length = '80%', left = '0' }) => (orientation === 'vertical' || vertical
    ? `
      height: ${length};
      left: ${left};
      width: 1px;
      margin: ${margin || 'auto 0'};`
    : `
      width: ${length};
      left: ${left};
      height: 1px;
      margin: ${margin || '0 auto'};`)
};
  transition: opacity, width, height 250ms ease-in-out;
  background-color: ${({ color }) => color || '#BCBDCE'};
  opacity: ${({ opacity = 1 }) => opacity};
  z-index: ${({ zIndex }) => zIndex};
`)

export const DividerVertical: FC<DividerProps>
  // eslint-disable-next-line react/jsx-props-no-spreading
  = memo((props) => <DividerLine vertical length='100%' {...props} />)
DividerVertical.displayName = 'DividerVertical'

export const DividerHorizontal: FC<DividerProps>
  // eslint-disable-next-line react/jsx-props-no-spreading
  = memo((props) => <DividerLine horizontal length='100%' {...props} />)
DividerHorizontal.displayName = 'DividerHorizontal'
