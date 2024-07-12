import { MouseEvent, PropsWithChildren } from 'react'


import { ITextProps } from '../text.types'
import { CommonProps } from '../../../../types/CommonProps'


export type AnchorLinkProps = Partial<ITextProps> & PropsWithChildren & CommonProps & {
  id?: string
  onClick?: (event?: MouseEvent, href?: string, target?: string, text?: string) => void
  asLink?: boolean
}
