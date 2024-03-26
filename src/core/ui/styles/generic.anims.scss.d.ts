export type Styles = {
  animBgr: string
  animFadeIn: string
  animSlideDown: string
  animSlideLeft: string
  animSlideRight: string
  animSlideUp: string
  animSpin: string
  animSpinInfinite: string
  breathOnHover: string
  'fade-in-animation': string
  'grow-animation': string
  'slide-down-animation': string
  'slide-left-animation': string
  'slide-right-animation': string
  'slide-up-animation': string
  'spin-animation': string
  'spin-animation-reset': string
};

export type ClassNames = keyof Styles;

declare const styles: Styles

export default styles
