import { memo, FC, PropsWithChildren, useMemo, CSSProperties, forwardRef, LegacyRef } from 'react'


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
  style, children, tabIndex, className = '', ...props
}: FBoxProps, ref: LegacyRef<HTMLDivElement> | undefined) => {
  const [restProps, cssProps] = useMemo(() => {
    const restProps: Record<string, unknown> = {}
    const cssProps: Record<string, unknown> = {}

    Object.entries(props).forEach(([key, value]) => {
      console.log('key', key, 'value', value)
      if (key.substr(0, 4) === 'data') {
        restProps[key] = value
      } else {
        cssProps[key] = value
      }
    })
    return [restProps, cssProps]
  }, [props])

  const styles = useMemo(() => (
    {
      ...cssProps,
      ...(cssProps.align ? { alignItems: resolveFlexProps(cssProps.align as string) } : {}),
      ...(cssProps.justify ? { justifyContent: resolveFlexProps(cssProps.justify as string) } : {}),
      ...(cssProps.direction ? { flexDirection: cssProps.direction } : {}),
      ...style,
    }
  ), [cssProps, style])

  return (
    <div
      ref={ref}
      tabIndex={tabIndex}
      className={`${(classes as any)['flexible-box']} ${className}`}
      style={styles as CSSProperties}
      {...restProps}
    >
      {children}
    </div>
  )
})

FBoxRefForwarded.displayName = 'FBoxRefForwarded'

export const FBox: FC<FBoxProps> = memo<FBoxProps>(FBoxRefForwarded)


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
