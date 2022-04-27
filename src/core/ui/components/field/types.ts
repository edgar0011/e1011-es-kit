import { FC } from 'react'

export type FieldError = any | Record<string, any> | undefined

export type IconComponentType = FC<{
  iconName: string
  icon?: string
  color?: string | ((props: any) => string)
  size?: string
  minWidth?: string
  minHeight?: string
}>
