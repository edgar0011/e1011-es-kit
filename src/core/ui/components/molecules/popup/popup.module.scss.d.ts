export type Styles = {
  'close-button': string
  'overflow-hidden': string
  'popup-container': string
  'popup-container-inner': string
  'popup-container-inner-div': string
  'text-ellipsis': string
  'text-nowrap': string
  'text-truncate': string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
