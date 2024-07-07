import React, { memo, PropsWithChildren, CSSProperties, FC, MouseEventHandler, useMemo } from 'react'

import { CommonProps } from '../../../types/CommonProps'
import { composeId } from '../../../../utils'
import { useParseProps } from '../../../../hooks'


export interface ITextProps extends PropsWithChildren, CSSProperties, CommonProps {
  element?: string | FC
  className?: string
  text?: string
  href?: string
  target?: string
  onClick?: MouseEventHandler
  disabled?: boolean
}

export type TextProps = ITextProps & { style?: CSSProperties; 'data-testid'?: string }


export const Text: FC<TextProps> = memo<ITextProps>((
  { element = 'span', children, href, target, className = '', id, onClick, text, ...rest }: ITextProps,
) => {
  const { dataProps, restProps } = useParseProps(rest)
  const textFromChildren: string | undefined = text || children?.toString()

  const onClickProps = useMemo(() => (onClick ? ({
    onClick,
    onKeyDown: onClick,
    role: 'button',
    tabIndex: -1,
  }) : {}), [onClick])

  return React.createElement<TextProps>(
    element,
    {
      id: `${id || (textFromChildren && composeId(textFromChildren))}`,
      href,
      text,
      target,
      className,
      ...onClickProps,
      style: restProps,
      ...dataProps,
      'data-testid':
      `${dataProps.dataTestId || dataProps['data-testid'] || id || (textFromChildren && composeId(textFromChildren))}`,
    },
    children,
  )
})

Text.displayName = 'Text'
