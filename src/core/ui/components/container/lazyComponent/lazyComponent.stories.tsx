/* eslint-disable consistent-return */
import { FC, ReactElement } from 'react'
import { StoryFn as Story, Meta } from '@storybook/react'

import { LayoutBox } from '../layoutBox/LayoutBox'
import { LayoutBoxProps } from '../layoutBox/layoutBox.types'
import { DividerProps } from '../../dividers'

import { LazyComponent, PendingBoundary, createLazyModule } from './LazyComponent'


export default {
  title: 'e1011/molecules/LazyComponent',
  component: LazyComponent,
} as Meta



const Placeholder = (props: LayoutBoxProps): ReactElement => (
  <LayoutBox align='center' justify='center' minWidth='200px' minHeight='200px' border='1px solid #EFEFEF' {...props}>
    PlaceHolder
  </LayoutBox>
)



const delayerPromise = (delayMS = 2000): Promise<any> => new Promise((resolve) => {
  setTimeout(() => {
    resolve(`delayed: ${delayMS}ms`)
  }, delayMS)
})

const delayerPendingPromise = (delayMS = 2000): { read: () => Promise<any> } => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(`delayed: ${delayMS}ms`)
    }, delayMS)
  })

  let result: unknown
  let status = 'pending'

  promise.then((res) => {
    result = res
    status = 'success'
  }, (reason) => {
    result = reason
    status = 'error'
  })

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    read() {
      if (status === 'pending') {
        throw promise
      } if (status === 'error') {
        throw result
      } if (status === 'success') {
        return result
      }
    },
  } as { read: () => any }
}


const DividerLineLazy: FC<DividerProps> = createLazyModule(
  () => import('../../dividers/DividerLine').then((module) => new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...module, default: module.DividerLine })
    }, 1000)
  })),
  'DividerLine',
  { padding: '20px', color: 'red' },
)


export const LazyModuleBase: Story = () => (
  <LayoutBox direction='column' width='100%' gap='2rem'>
    <DividerLineLazy />
  </LayoutBox>
)


export const PendingBoundaryBase: Story = () => (
  <LayoutBox direction='column' width='100%' gap='2rem'>
    <PendingBoundary promise={delayerPromise()}>
      <Placeholder />
    </PendingBoundary>
  </LayoutBox>
)

export const PendingBoundaryBase2: Story = () => (
  <LayoutBox direction='column' width='100%' gap='2rem'>
    <PendingBoundary fallback={<div>bare minimum loader...</div>} pendingPromise={delayerPendingPromise()}>
      <Placeholder />
    </PendingBoundary>
  </LayoutBox>
)

export const PendingBoundaryError: Story = () => (
  <LayoutBox direction='column' width='100%' gap='2rem'>
    <PendingBoundary promise={new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('I have a bad feeling about this'))
      }, 2000)
    })}
    >
      <button type='button'>Submit</button>
    </PendingBoundary>
  </LayoutBox>
)
