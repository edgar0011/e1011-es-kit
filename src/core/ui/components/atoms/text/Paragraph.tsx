import { memo } from 'react'

import { ITextProps } from './text.types'
import { Text } from './Text'
import classes from './typography.module.scss'


export const Paragraph = memo(
  ({ children, text, className = '', ...props }: ITextProps) => (
    <Text {...props} className={`${classes.paragraph} ${className}`} element='p'>
      {children && children}
      {(!children && text) && text}
    </Text>
  ),
)

Paragraph.displayName = 'Paragraph'


export const ParagraphSmall = memo(
  ({ children, text, className = '', ...props }: ITextProps) => (
    <Text {...props} className={`${classes.paragraphSmall} ${className}`} element='p'>
      {children && children}
      {(!children && text) && text}
    </Text>
  ),
)

ParagraphSmall.displayName = 'ParagraphSmall'


export const ParagraphBold = memo(
  ({ children, text, className = '', ...props }: ITextProps) => (
    <Text {...props} className={`${classes.paragraphBold} ${className}`} element='p'>
      {children && children}
      {(!children && text) && text}
    </Text>
  ),
)

ParagraphBold.displayName = 'ParagraphBold'


export const ParagraphBoldSmall = memo(
  ({ children, text, className = '', ...props }: ITextProps) => (
    <Text {...props} className={`${classes.paragraphBoldSmall} ${className}`} element='p'>
      {children && children}
      {(!children && text) && text}
    </Text>
  ),
)

ParagraphBoldSmall.displayName = 'ParagraphBoldSmall'
