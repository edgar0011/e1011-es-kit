import { memo, FC, useMemo, CSSProperties, forwardRef, LegacyRef } from 'react'

import { useParseProps } from '../../../hooks/useParseProps'

import { LayoutBoxProps } from './layoutBox.types'
import classes from './layoutBox.module.scss'


const flexValueMap: Record<string, string> = {
  start: 'flex-start',
  'flex-start': 'flex-start',
  end: 'flex-end',
  'flex-end': 'flex-end',
}

const resolveFlexProps = (value?: string): string | undefined => (value ? (flexValueMap[value] || value) : value)


const LayoutBoxRefForwarded = forwardRef(({
  style, children, tabIndex, className = '', ...props
}: LayoutBoxProps, ref: LegacyRef<HTMLDivElement> | undefined) => {
  const { dataProps, restProps } = useParseProps(props)

  const styles = useMemo(() => (
    {
      ...restProps,
      ...(restProps.align ? { alignItems: resolveFlexProps(restProps.align as string) } : {}),
      ...(restProps.justify ? { justifyContent: resolveFlexProps(restProps.justify as string) } : {}),
      ...(restProps.direction ? { flexDirection: restProps.direction } : {}),
      ...style,
    }
  ), [restProps, style])

  return (
    <div
      ref={ref}
      tabIndex={tabIndex}
      className={`${(classes as any)['flexible-box']} ${className}`}
      style={styles as CSSProperties}
      {...dataProps}
    >
      {children}
    </div>
  )
})

LayoutBoxRefForwarded.displayName = 'LayoutBoxRefForwarded'

export const LayoutBox: FC<LayoutBoxProps> = memo<LayoutBoxProps>(LayoutBoxRefForwarded)


LayoutBox.displayName = 'LayoutBox'


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
