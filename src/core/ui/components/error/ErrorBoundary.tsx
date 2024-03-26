import { FC, memo, PureComponent, ReactNode, PropsWithChildren, ComponentType } from 'react'

import { IconBase } from '../icon'
import { LayoutBox } from '../container/layoutBox/LayoutBox'

import classes from './errorBoundary.module.scss'


type Props = PropsWithChildren<unknown> & {
  ErrorComponent?: ComponentType
}

interface State {
  error?: Error
  errorInfo?: unknown
  hasError: boolean
}


export type DefaultErrorComponentProps = {
  title?: string
  text?: string
}

export const DefaultErrorComponent: FC<DefaultErrorComponentProps>
= memo(({ title, text }: DefaultErrorComponentProps) => (
  <LayoutBox className={classes.errorBoundary} direction='column' flexWrap='wrap' gap='2rem' padding='1rem'>
    {title && <h1>{title}</h1>}
    <LayoutBox align='center' justify='space-between' gap='1rem'>
      <IconBase
        className={classes.StyledIcon}
        color='#FF0000'
        width='3rem'
        height='3rem'
      >
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
          <path d='M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z' />
        </svg>
      </IconBase>
      {text && (
        <LayoutBox flexShrink='0' width='90%'>
          {text}
        </LayoutBox>
      )}
    </LayoutBox>
  </LayoutBox>
))
DefaultErrorComponent.displayName = 'DefaultErrorComponent'

export class ErrorBoundary extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    error && console.error(error)
    // eslint-disable-next-line no-console
    errorInfo && console.error(errorInfo)
    // this.lastError = { error, errorInfo }
    this.setState({ hasError: true, error, errorInfo })
  }

  render():ReactNode {
    const { ErrorComponent = DefaultErrorComponent } = this.props
    const { hasError, error, errorInfo } = this.state

    if (hasError) {
      return <ErrorComponent title={error?.toString() || 'Error'} text={`${JSON.stringify(errorInfo, null, 2)}`} />
    }

    return this.props.children
  }
}
