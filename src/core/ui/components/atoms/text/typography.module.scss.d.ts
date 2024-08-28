export type Styles = {
  disabled: string
  headline: string
  headlineSecondary: string
  headlineTertiary: string
  link: string
  'overflow-hidden': string
  paragraph: string
  paragraphBold: string
  paragraphBoldSmall: string
  paragraphSmall: string
  'text-ellipsis': string
  'text-nowrap': string
  'text-truncate': string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
