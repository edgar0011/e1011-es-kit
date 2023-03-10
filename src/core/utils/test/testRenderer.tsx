import { ReactElement, FC, PropsWithChildren } from 'react'
import { render, RenderOptions, RenderResult, configure } from '@testing-library/react'

type Props = PropsWithChildren<any>

const AllTheProviders: FC<Props> = function AllTheProviders ({ children }: Props): ReactElement<any> {
  return (
    <div id='es1011-test-wrapper'>
      {children}
    </div>
  ) as ReactElement<any>
}

const customRender = (
  ui: ReactElement, options?: RenderOptions,
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

configure({ testIdAttribute: 'data-test-id' })

// override render method
export { customRender as render }
