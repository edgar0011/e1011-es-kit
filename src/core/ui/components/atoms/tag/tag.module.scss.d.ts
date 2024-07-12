export type Styles = {
  alert: string
  clickable: string
  critical: string
  default: string
  error: string
  high: string
  'in-table': string
  info: string
  information: string
  low: string
  medium: string
  'overflow-hidden': string
  success: string
  tag: string
  text: string
  'text-ellipsis': string
  'text-nowrap': string
  'text-truncate': string
  'very-low': string
  warning: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
