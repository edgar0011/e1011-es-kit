import React, { FC, memo, PropsWithChildren } from 'react'

import { FlexWrapper, FlexProps } from './Flex'

type PlaceholderProps = FlexProps & PropsWithChildren<unknown> & {
  title?: string
  cssProp?: string
  background?: string
  border?: string
  onClick?: () => void
}

export const Placeholder: FC<PlaceholderProps>
= memo<PlaceholderProps>(({ title, border, background, onClick, cssProp, children, ...props }: PlaceholderProps) => (
  <FlexWrapper
    css={`
      ${border || 'border: 1px solid #999999;'}
      ${background || 'background-color: rgba(0, 120, 255, 0.2);'}
      ${cssProp}
    `}
    onClick={onClick}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {title && (<h2>{title}</h2>)}
    {children && children}
  </FlexWrapper>
))

Placeholder.displayName = 'Placeholder'
