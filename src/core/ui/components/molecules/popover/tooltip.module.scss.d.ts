export type Styles = {
  arrow: string
  'arrow-inner': string
  'close-button': string
  'overflow-hidden': string
  'popover-tooltip': string
  'text-ellipsis': string
  'text-nowrap': string
  'text-truncate': string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
