export type Styles = {
  afterContent: string
  beforeContent: string
  flowLayout: string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
