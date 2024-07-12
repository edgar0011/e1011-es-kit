import { memo, FC, useMemo } from 'react'

import { PropsValidationError } from '../../error/propsValidationError'
import { IconBase } from '../../icon'
import { LayoutBox } from '../../container'
import { Text as BodyText } from '../text/Text'

import type { TextAndContentProps, TextAndIconsProps } from './textAndContent.types'
import classes from './textAndContent.module.scss'


/**
 * TextAndContent component.
 *
 * @type {React.FC<TextAndContentProps>}
 * @returns {React.ReactElement} The TextAndContent.
 */
export const TextAndContent: FC<TextAndContentProps> = memo<TextAndContentProps>(({
  text,
  children,
  components,
  leftContent,
  rightContent,
  textProps = {},
  className = '',
  ...props
}: TextAndContentProps) => {
  if ((text === undefined || text === null) && !children) {
    throw new PropsValidationError('Missing `text or children` property!')
  }

  const TextComponent = components?.TextComponent || BodyText

  return (
    <LayoutBox
      className={`${classes.textAndContent} ${className}`}
      {...props}
    >
      {leftContent && leftContent}
      <TextComponent className='text-truncate' {...textProps} data-testid='text-content-text-component'>{text || children}</TextComponent>
      {rightContent && rightContent}
    </LayoutBox>
  )
})

TextAndContent.displayName = 'TextAndContent'


/**
 * TextAndIcons component.
 *
 * @type {React.FC<TextAndIconsProps>}
 * @returns {React.ReactElement} The TextAndIcons.
 */
export const TextAndIcons: FC<TextAndIconsProps> = memo<TextAndIconsProps>(({
  iconSize,
  iconColor,
  iconLeft,
  iconRight,
  iconLeftUrl,
  iconRightUrl,
  onLeftIconClick,
  onRightIconClick,
  ...props
}: TextAndIconsProps) => {
  const [leftContent, rightContent] = useMemo(() => {
    let leftContent
    let rightContent

    if (iconLeft || iconLeftUrl) {
      const onLeftIconClickProps = onLeftIconClick ? ({
        onClick: onLeftIconClick,
        onKeyDown: onLeftIconClick,
        role: 'button',
        tabIndex: -1,
        'data-testid': 'text-content-icon-left',
      }) : {}

      leftContent = (
        <IconBase iconUrl={iconLeftUrl} size={iconSize} color={iconColor} {...onLeftIconClickProps}>
          {iconLeft && iconLeft}
        </IconBase>)
    }
    if (iconRight || iconRightUrl) {
      const onRightIconClickProps = onRightIconClick ? ({
        onClick: onRightIconClick,
        onKeyDown: onRightIconClick,
        role: 'button',
        tabIndex: -1,
        'data-testid': 'text-content-icon-right',
      }) : {}

      rightContent = (
        <IconBase iconUrl={iconRightUrl} size={iconSize} color={iconColor} {...onRightIconClickProps}>
          {iconRight && iconRight}
        </IconBase>)
    }
    return [leftContent, rightContent]
  }, [iconColor, iconLeft, iconLeftUrl, iconRight, iconRightUrl, iconSize, onLeftIconClick, onRightIconClick])


  return (
    <TextAndContent
      leftContent={leftContent}
      rightContent={rightContent}
      {...props}
    />
  )
})

TextAndIcons.displayName = 'TextAndIcons'
