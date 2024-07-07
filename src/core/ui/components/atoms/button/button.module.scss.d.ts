export type Styles = {
  animated: string
  button: string
  disabled: string
  error: string
  fluid: string
  hasIcon: string
  hasShadow: string
  info: string
  'overflow-hidden': string
  success: string
  'text-ellipsis': string
  'text-nowrap': string
  'text-truncate': string
  tiny: string
  transparent: string
  truncate: string
  warning: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
