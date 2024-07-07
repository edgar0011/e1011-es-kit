import { StoryFn as Story, Meta } from '@storybook/react'

import { Link } from '../text'
import { IconBase } from '../../icon'
import { LayoutBox } from '../../container'
import { Alerts } from '../../../../constants'

import { Button } from './Button'
import type { ButtonProps } from './button.types'


export default {
  title: 'e1011/atoms/button/Button',
  component: Button,
} as Meta


const ButtonTemplate: Story<ButtonProps> = (args) => (
  <LayoutBox width='100%' column align='center' gap='1rem'>
    <LayoutBox width='100%' height='100%' justify='center' align='center' gap='1rem'>
      <Button {...args}>01</Button>
      <Button {...args}>Some Text <Link href='https://www.google.com' target='sdsdsd'>Link to google.com</Link></Button>
      {/* Tiny is suitable only for numbers */}
      <Button tiny {...args}>4</Button>
      <Button variant={Alerts.info} {...args}>11</Button>
      <Button variant={Alerts.warning} {...args}>86</Button>
      <Button variant={Alerts.success} {...args}>999</Button>
      <Button variant={Alerts.error} {...args}>0909</Button>
      <Button variant={Alerts.error} {...args}>Can it handle long text?</Button>

      <LayoutBox width='100px'>
        <Button variant={Alerts.error} truncate fluid {...args}>
          Can it handle long text and be truncated?
        </Button>
      </LayoutBox>
    </LayoutBox>
    <LayoutBox width='280px' height='100%' justify='center' align='center' gap='1rem'>
      <Button transparent variant={Alerts.error} truncate fluid {...args}>Can it handle long text?</Button>
      <Button variant={Alerts.error} fluid {...args}>Can it handle long text?</Button>
    </LayoutBox>
    <LayoutBox width='100%'>
      <Button transparent variant={Alerts.info} {...args}>Transparent</Button>
    </LayoutBox>
    <LayoutBox width='100%'>
      <Button hasIcon variant={Alerts.info} {...args}>
        <IconBase>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 488 512'>
            <path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z' />
          </svg>
        </IconBase>
      </Button>
    </LayoutBox>
  </LayoutBox>
)

export const ButtonBase = ButtonTemplate.bind({})
ButtonBase.args = {}
