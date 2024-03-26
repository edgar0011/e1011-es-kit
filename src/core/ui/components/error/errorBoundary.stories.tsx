import { ReactElement } from 'react'
import { StoryFn as Story, Meta } from '@storybook/react'

import { LayoutBox } from '../container'

import { ErrorBoundary } from './ErrorBoundary'
import type { ErrorBoundaryProps } from './errorBoundary.types'


export default {
  title: 'e1011/molecules/error/ErrorBoundary',
  component: ErrorBoundary,
} as Meta

const ThisThrowsErrorUI = (): ReactElement => {
  throw new Error('This does nothing, even no UI, what is this, am I inside an ErrorBoundary?')
}

const ErrorBoundaryTemplate: Story<ErrorBoundaryProps> = (args: ErrorBoundaryProps) => (
  <LayoutBox width='100%' height='100%' justify='center' align='center' direction='column'>
    <ErrorBoundary {...args}>
      <ThisThrowsErrorUI />
    </ErrorBoundary>
  </LayoutBox>
)

export const ErrorBoundaryBase = ErrorBoundaryTemplate.bind({})
ErrorBoundaryBase.args = {}

export const ErrorBoundaryCustomText = ErrorBoundaryTemplate.bind({})
ErrorBoundaryCustomText.args = {
  title: 'Error Custom Title',
  text: 'Error Custom Text',
}
