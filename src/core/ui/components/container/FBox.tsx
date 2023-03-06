import { memo, PropsWithChildren, useMemo, CSSProperties, forwardRef, LegacyRef } from 'react'


import classes from './fbox.module.scss'


export type FBoxProps = PropsWithChildren<any> &{
  flex?: string
  flexGrow?: string | number
  alignText?: 'center' | 'right' | 'left'
  direction?: string
  flexShrink?: string | number
  flexBasis?: string
  flexWrap?: string
  justify?: string
  align?: string
  alignSelf?: string
  margin?: string
  padding?: string
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
  gap?: string
  css?: string
  borderRadius?: string
  style?: CSSProperties
  className?: string
}

const flexValueMap: Record<string, string> = {
  start: 'flex-start',
  'flex-start': 'flex-start',
  end: 'flex-end',
  'flex-end': 'flex-end',
}

const resolveFlexProps = (value?: string): string | undefined => (value ? (flexValueMap[value] || value) : value)


const FBoxRefForwarded = forwardRef(({
  style, children, className = '', ...props
}: FBoxProps, ref: LegacyRef<HTMLDivElement> | undefined) => {
  const styles = useMemo(() => (
    {
      ...style,
      ...props,
      ...(props.align ? { alignItems: resolveFlexProps(props.align) } : {}),
      ...(props.justify ? { justifyContent: resolveFlexProps(props.justify) } : {}),
      ...(props.direction ? { flexDirection: props.direction } : {}),
    }
  ), [props, style])

  return (
    <div
      ref={ref}
      className={`${(classes as any)['flexible-box']} ${className}`}
      style={styles as CSSProperties}
    >
      {children}
    </div>
  )
})

FBoxRefForwarded.displayName = 'FBoxRefForwarded'

export const FBox = memo<FBoxProps>(FBoxRefForwarded)


FBox.displayName = 'FBox'


// default flex centralized, 100% width and height
// export const FlexWrapper = memo(styled(Flex).attrs((props: Partial<FlexProps>) => (
//   {
//     width: props.width || '100%',
//     height: props.height || '100%',
//     justify: props.justify || 'center',
//     align: props.align || 'center',
//     ...props,
//   }
// ))``)

// export const FlexTight = memo(styled(Flex).attrs((props: Partial<FlexProps>) => ({
//   size: 'unset',
//   width: 'initial',
//   ...props,
// }))``)

// export const FlexTightStyled = memo(styled(Flex).attrs((props: Partial<FlexProps>) => ({
//   size: 'unset',
//   width: 'initial',
//   style: {
//     text: 'blue',
//     padding: '1rem',
//     border: '1px solid green',
//   },
//   ...props,
// }))``)
