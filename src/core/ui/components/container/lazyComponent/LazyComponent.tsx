/* eslint-disable react/display-name */
import { FC, memo, Suspense, lazy, ComponentType, PropsWithChildren, useRef, useMemo, ReactNode } from 'react'

import { ErrorBoundary } from '../../error/ErrorBoundary'

import classes from './lazyComponent.module.scss'


// not always necessary, since createLayzModule is called once per module,
// but when nesting, inside loaded modules...
const map: Record<string, FC<any>> = {}

type ReactModule = {
  default: ComponentType<any>
}

export type LazyComponentProps = PropsWithChildren<any> & {
  PropsWithChildren?: ComponentType<any>
  LoaderJSX?: JSX.Element
}

export type wrapPromiseType = (promise: (() => Promise<any>) | Promise<any>) => { read: () => Promise<unknown> }

export const wrapPromise: wrapPromiseType = (promise: (() => Promise<any>) | Promise<any>) => {
  let status = 'pending'
  let result: any
  const suspend = (typeof promise === 'function' ? promise() : promise).then(
    (res) => {
      status = 'success'
      result = res
    },
    (err) => {
      status = 'error'
      result = err
    },
  )

  return {
    // eslint-disable-next-line consistent-return
    read(): any {
      if (status === 'pending') {
        throw suspend
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    },
  }
}

const getDefaultLoader = (): ReactNode => (
  <div className={classes.loader}>
    <svg className='spinner' viewBox='0 0 50 50'>
      <circle className='path' cx='25' cy='25' r='20' fill='none' strokeWidth='5' />
    </svg>
  </div>
)

export const LazyComponent: FC<LazyComponentProps>
= memo<LazyComponentProps>(({ children, Component, LoaderJSX, ...props }: LazyComponentProps) => (
  <ErrorBoundary>
    <Suspense fallback={LoaderJSX || getDefaultLoader()}>
      {Component && <Component {...props} />}
      {children && children}
    </Suspense>
  </ErrorBoundary>
))

LazyComponent.displayName = 'LazyComponent'

export type PendingBoundaryProps = PropsWithChildren & {
  fallback?: JSX.Element
  promise?: Promise<unknown>
  pendingPromise?: { read: () => Promise<unknown> }
}

export const PendingBoundary: FC<PendingBoundaryProps>
= memo<PendingBoundaryProps>(({ pendingPromise, promise, fallback, children }: PendingBoundaryProps) => {
  const wrappedPromiseRef = useRef(pendingPromise || (promise && wrapPromise(promise)))

  const InnerComponent: FC<PropsWithChildren<any>> = useMemo(() => ({ children }: PropsWithChildren<any>) => {
    const innerPromise = wrappedPromiseRef.current?.read?.()

    return innerPromise?.then ? null : children
  }, [])

  return (
    <LazyComponent LoaderJSX={fallback}>
      <InnerComponent>{children}</InnerComponent>
    </LazyComponent>
  )
})

PendingBoundary.displayName = 'PendingBoundary'


export const createLazyModule = (
  lazyResolver: () => Promise<ReactModule>,
  displayName: string,
  defaultProps: Record<string, unknown> = {},
): FC<unknown> => {
  if (!map[displayName]) {
    const Component = lazy(lazyResolver)

    // eslint-disable-next-line react/display-name
    map[displayName] = memo((props) => (<LazyComponent Component={Component} {...defaultProps} {...props} />))
    map[displayName].displayName = displayName
  }

  return map[displayName]
}


export const createLazyModuleWithStore = <T, ComponentType>(
  lazyResolver: (store: T) => Promise<ReactModule>,
  displayName: string,
  defaultProps: Record<string, unknown>,
): (store: T) => FC<ComponentType> => (store: T) => {
    if (!map[displayName]) {
      const Component = lazy(() => lazyResolver(store))

      // eslint-disable-next-line react/display-name
      map[displayName] = memo((props) => (<LazyComponent Component={Component} {...defaultProps} {...props} />))
      map[displayName].displayName = displayName
    }

    return map[displayName]
  }
