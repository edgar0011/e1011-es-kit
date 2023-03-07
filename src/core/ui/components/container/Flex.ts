import { memo } from 'react'
import styled from 'styled-components'

export type FlexProps = {
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
}

const flexValueMap: Record<string, string> = {
  start: 'flex-start',
  'flex-start': 'flex-start',
  end: 'flex-end',
  'flex-end': 'flex-end',
}

const resolveFlexProps = (value?: string): string | undefined => (value ? (flexValueMap[value] || value) : value)

export const Flex = memo(styled.div<FlexProps>`
  display: flex;
  position: relative;
  flex-direction: ${({ direction }: Partial<FlexProps>) => direction || 'row'};
  flex: ${({ flex }: Partial<FlexProps>) => (flex !== undefined ? flex : '0')};
  flex-grow: ${({ flexGrow }: Partial<FlexProps>) => (flexGrow !== undefined ? flexGrow : '0')};
  flex-shrink: ${({ flexShrink }: Partial<FlexProps>) => (flexShrink !== undefined ? flexShrink : '0')};
  flex-basis: ${({ flexBasis }: Partial<FlexProps>) => flexBasis || 'auto'};
  flex-wrap: ${({ flexWrap }: Partial<FlexProps>) => flexWrap || 'nowrap'};
  gap: ${({ gap }: Partial<FlexProps>) => (gap !== undefined ? gap : '0')};
  text-align: ${({ alignText }: Partial<FlexProps>) => alignText || 'left'};
  justify-content: ${({ justify }: Partial<FlexProps>) => resolveFlexProps(justify) || 'flex-start'};
  align-items: ${({ align }: Partial<FlexProps>) => resolveFlexProps(align) || 'flex-start'};
  align-self: ${({ alignSelf }: Partial<FlexProps>) => alignSelf || 'auto'};
  margin: ${({ margin }: Partial<FlexProps>) => margin || '0'};
  padding: ${({ padding }: Partial<FlexProps>) => padding || '0'};
  width: ${({ width }: Partial<FlexProps>) => width || 'auto'};
  height: ${({ height }: Partial<FlexProps>) => height || 'auto'};
  max-width: ${({ maxWidth }: Partial<FlexProps>) => maxWidth || 'none'};
  max-height: ${({ maxHeight }: Partial<FlexProps>) => maxHeight || 'none'};
  min-width: ${({ minWidth }: Partial<FlexProps>) => ((minWidth || minWidth === '0') ? minWidth : '0')};
  min-height: ${({ minHeight }: Partial<FlexProps>) => minHeight || '0'};
  border-radius: ${({ borderRadius }: Partial<FlexProps>) => borderRadius || 'initial'};
`)

// default flex centralized, 100% width and height
export const FlexWrapper = memo(styled(Flex).attrs((props: Partial<FlexProps>) => (
  {
    width: props.width || '100%',
    height: props.height || '100%',
    justify: props.justify || 'center',
    align: props.align || 'center',
    ...props,
  }
))``)

export const FlexTight = memo(styled(Flex).attrs((props: Partial<FlexProps>) => ({
  width: 'initial',
  ...props,
}))``)

export const FlexTightStyled = memo(styled(Flex).attrs((props: Partial<FlexProps>) => ({
  width: 'initial',
  style: {
    text: 'blue',
    padding: '1rem',
    border: '1px solid green',
  },
  ...props,
}))``)
