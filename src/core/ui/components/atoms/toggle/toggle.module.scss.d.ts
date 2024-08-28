export type Styles = {
  disabled: string
  'overflow-hidden': string
  slider: string
  'text-ellipsis': string
  'text-nowrap': string
  'text-truncate': string
  toggle: string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
