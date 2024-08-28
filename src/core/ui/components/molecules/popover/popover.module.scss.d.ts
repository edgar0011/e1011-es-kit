export type Styles = {
  arrow: string
  'arrow-inner': string
  'popover-container': string
  'popover-container-inner': string
  'popover-container-lite': string
  'popover-tooltip': string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
