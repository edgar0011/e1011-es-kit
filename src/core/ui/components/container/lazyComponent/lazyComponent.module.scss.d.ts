export type Styles = {
  dash: string
  loader: string
  path: string
  rotate: string
  spinner: string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
