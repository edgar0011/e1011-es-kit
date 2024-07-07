import { memo } from 'react'

import { ITextProps, Text } from './Text'
import classes from './typography.module.scss'


export const Headline = memo(
  ({ children, text, className = '', ...props }: ITextProps) => (
    <Text {...props} className={`${classes.headline} ${className}`} element='h1'>
      {children && children}
      {(!children && text) && text}
    </Text>
  ),
)

Headline.displayName = 'Headline'


export const HeadlineSecondary = memo(
  ({ children, text, className = '', ...props }: ITextProps) => (
    <Text {...props} className={`${classes.headlineSecondary} ${className}`} element='h2'>
      {children && children}
      {(!children && text) && text}
    </Text>
  ),
)

HeadlineSecondary.displayName = 'HeadlineSecondary'


export const HeadlineTertiary = memo(
  ({ children, text, className = '', ...props }: ITextProps) => (
    <Text {...props} className={`${classes.headlineTertiary} ${className}`} element='h3'>
      {children && children}
      {(!children && text) && text}
    </Text>
  ),
)

HeadlineTertiary.displayName = 'HeadlineTertiary'
