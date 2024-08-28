export type Styles = {
  anchorLink: string
  disabled: string
  'overflow-hidden': string
  'text-ellipsis': string
  'text-nowrap': string
  'text-truncate': string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
