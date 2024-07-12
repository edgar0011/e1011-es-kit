import React, { memo, FC, useMemo } from 'react'

import { composeId } from '../../../../utils'
import { useParseProps } from '../../../../hooks'

import { ITextProps, TextProps } from './text.types'


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
