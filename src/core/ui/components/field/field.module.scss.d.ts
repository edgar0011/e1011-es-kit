export type Styles = {
  disabled: string
  field: string
  help: string
  icon: string
  input: string
  'is-action': string
  label: string
  mainControl: string
  select: string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
