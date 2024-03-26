export type Styles = {
  'divider-line': string
  horizontal: string
  vertical: string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
