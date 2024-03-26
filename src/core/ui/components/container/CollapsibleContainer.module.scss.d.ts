export type Styles = {
  collapsed: string
  'collapsible-container': string
  expanded: string
  horizontal: string
  vertical: string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
