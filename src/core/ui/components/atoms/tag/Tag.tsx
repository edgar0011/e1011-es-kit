import { memo, FC, useMemo, useRef, CSSProperties, useState, RefObject } from 'react'

import { TextAndIcons } from '../textAndContent/TextAndContent'
import { LayoutBox } from '../../container/layoutBox/LayoutBox'
import { useClassNames, useParseProps, useResize, WrapperSize } from '../../../../hooks'
import { composeId } from '../../../../utils'
import { Tooltip } from '../../molecules'
import { Text as BodyText } from '../text'

import classes from './tag.module.scss'
import { TagProps, TagVariant } from './tag.types'


const styles = {
  textWrapper: { position: 'relative' },
  textTransformedWrapperTipPlaceholder: {
    position: 'absolute',
    top: 0,
    background: 'transparent',
    zIndex: 0,
    userSelect: 'none',
  },
}

/**
 * Tag component.
 *  *
 * @type {React.FC<TagProps>}
 * @returns {React.ReactElement} The Tag.
 */
export const Tag: FC<TagProps> = memo<TagProps>(({
  variant = TagVariant.default,
  text,
  hashtag,
  components,
  onClick,
  children,
  inTable,
  className = '',
  ...props
}: TagProps) => {
  const TextComponent = components?.TextComponent || BodyText

  const classesResolved = useClassNames([
    classes.tag,
    variant && classes[variant],
    onClick && classes.clickable,
    inTable && classes['in-table'],
    className,
  ], [classes])

  const { dataProps, restProps } = useParseProps(props)
  const [isTruncated, setIsTruncated] = useState(false)

  const wrapperSizeRef = useRef<WrapperSize | null>(null)
  const tooltipTargetRef = useRef<HTMLDivElement | null>(null)

  const [textRef] = useResize(50, ({ width, height }: WrapperSize) => {
    const element = textRef.current

    if (element) {
      setIsTruncated(element.offsetWidth < element.scrollWidth)
    }
    wrapperSizeRef.current = { width, height }
  })

  const hasContent = useMemo(() => !!(children
    || text
    || restProps?.iconLeftUrl
    || restProps?.iconLeft
    || restProps?.iconRightUrl
    || restProps?.iconRight
  ), [children, text, restProps?.iconLeftUrl, restProps?.iconLeft, restProps?.iconRightUrl, restProps?.iconRight])

  const stylesTipPlaceholder = useMemo(() => (isTruncated ? ({
    ...styles.textTransformedWrapperTipPlaceholder,
    width: `${wrapperSizeRef?.current?.width}px`,
    height: `${wrapperSizeRef?.current?.height}px`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }) : null), [isTruncated, wrapperSizeRef?.current])

  return (
    <>
      <LayoutBox
        id={`${(typeof props.id !== 'undefined' && props.id) || (text && composeId(text))}`}
        className={classesResolved}
        {...dataProps}
        {...restProps}
        data-testid={`${dataProps.dataTestId || dataProps['data-testid'] || props.id || (text && composeId(text))}`}
        onClick={onClick}
      >
        {hashtag && <TextComponent>#</TextComponent>}
        {hasContent
          && (
            <TextAndIcons
              className={classes.text}
              iconSize='0.8em'
              {...restProps}
              width='auto'
            >
              <div ref={textRef as RefObject<HTMLDivElement>} className='text-truncate'>
                {isTruncated && (
                  <>
                    <div ref={tooltipTargetRef} style={stylesTipPlaceholder as CSSProperties} />
                    <span>{children || text}</span>
                  </>
                )}
                {!isTruncated && (children || text)}
              </div>
            </TextAndIcons>
          )}
      </LayoutBox>
      {isTruncated && <Tooltip text={text} targetRef={tooltipTargetRef} />}
    </>
  )
})

Tag.displayName = 'Tag'
