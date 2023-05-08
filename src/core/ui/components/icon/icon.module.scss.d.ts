export type IconStylesType = {
  'icon-base': string
  'icon-base-parent': string
};

export type IconClassNames = keyof IconStylesType;

declare const styles: IconStylesType

export default styles
