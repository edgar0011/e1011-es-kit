import { memo } from 'react'

import { ITextProps, Text } from './Text'
import classes from './typography.module.scss'


export const Link = memo(
  ({ children, text, className = '', ...props }: ITextProps) => (
    <Text {...props} className={`${classes.link} ${className}`} element='a'>
      {children && children}
      {(!children && text) && text}
    </Text>
  ),
)

Link.displayName = 'Link'

