import { memo, FC, useCallback, MouseEvent, useMemo } from 'react'

import { Link } from '../Link'
import { classNames, composeId } from '../../../../../utils'

import type { AnchorLinkProps } from './anchorLink.types'
import classes from './anchorLink.module.scss'



/**
 * AnchorLink component.
 *
 * @type {React.FC<AnchorLinkProps>}
 * @returns {React.ReactElement} The AnchorLink.
 */
export const AnchorLink: FC<AnchorLinkProps> = memo<AnchorLinkProps>(({
  id,
  onClick,
  href,
  asLink = false,
  text,
  children,
  className = '',
  ...props
}: AnchorLinkProps) => {
  const textFromChildren: string | undefined = text || children?.toString()

  const clickHandler = useCallback((event?: MouseEvent) => {
    if (onClick) {
      event?.preventDefault()
      event?.stopPropagation()
      return onClick(event, href, props.target, children as string)
    }

    return null
  }, [href, onClick, children, props.target])

  const onClickProps = useMemo(() => (onClick ? ({
    onClick: clickHandler,
    onKeyDown: clickHandler,
    role: 'button',
    tabIndex: -1,
  }) : {}), [clickHandler, onClick])

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <span
      {...onClickProps}
      id={`${(typeof id !== 'undefined' && id) || (textFromChildren && composeId(textFromChildren))}`}
      data-testid={props.dataTestId || props['data-testid'] || id || (textFromChildren && composeId(textFromChildren))}
    >
      {asLink && <Link href={href || ''} {...props}>{children || text || href}</Link>}
      {!asLink && (
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      /* @ts-ignore */
      <a
        href={href || ''}
        className={
          classNames(classes.anchorLink, props.disabled && classes.disabled, className)
        }
        {...props}
      >{children || text || href}
      </a>
      )}
    </span>


  )
})

export type AnchorLinkType = typeof AnchorLink;

AnchorLink.displayName = 'AnchorLink'
