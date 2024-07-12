import { Meta, StoryFn as Story } from '@storybook/react'

import { pencilIcon as pencilSVG } from '../icons'
import { HeadlineTertiary } from '../text'
import { DividerHorizontal } from '../../dividers'
import { LayoutBox } from '../../container'
import { PopoverPlacement, Tooltip } from '../../molecules'
import { generateId, noop } from '../../../../utils'

import { Tag } from './Tag'
import { TagProps, TagVariant } from './tag.types'


export default {
  title: 'e1011/atoms/Tag',
  component: Tag,
  variant: null,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'very-low', 'low', 'medium', 'high', 'critical',
        'information', 'success', 'alert', 'error', 'warning'],
    },
    onClick: {
      control: {
        type: 'select',
        options: {
          withOnClickFunction: noop,
          withoutOnClickFunction: null,
        },
      },
    },
  },
} as Meta<TagProps>

const TagTemplate: Story<TagProps> = (args) => (
  <LayoutBox width='100%' direction='column' height='100%' justify='center' align='center' gap='1rem'>
    <HeadlineTertiary cursor='pointer'>Tag</HeadlineTertiary>
    <LayoutBox width='100%' height='100%' justify='center' align='center' gap='1rem'>
      <Tag {...args} data-testid={generateId('tag', true, 0)} hashtag />
      <Tag {...args} data-testid={generateId('tag', true, 0)} iconLeft={pencilSVG} />
      <Tag {...args} data-testid={generateId('tag', true, 0)} />
      <Tag {...args} data-testid={generateId('tag', true, 0)} iconRight={pencilSVG} />
      <Tag {...args} data-testid={generateId('tag', true, 0)} hashtag iconRight={pencilSVG} />
      <Tag {...args} data-testid={generateId('tag', true, 0)} iconLeft={pencilSVG} iconRight={pencilSVG} />
    </LayoutBox>

    <DividerHorizontal color='var(--bs-primary)' />

    <HeadlineTertiary cursor='pointer'>Severity and alerts color</HeadlineTertiary>
    <LayoutBox direction='row' gap='1rem' width='100%' height='100%' justify='center' align='center'>
      <Tag data-testid={generateId('tag')} variant={TagVariant.info} text='info' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.veryLow} text='very-low' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.low} text='low' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.medium} text='medium' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.high} text='high' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.critical} text='critical' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.information} text='information' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.success} text='success' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.alert} text='alert' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.error} text='error' />
      <Tag data-testid={generateId('tag')} variant={TagVariant.warning} text='warning' />
    </LayoutBox>

    <DividerHorizontal color='var(--bs-primary)' />

    <HeadlineTertiary cursor='pointer'>Feature variants </HeadlineTertiary>
    <LayoutBox direction='row' gap='1rem' width='100%' height='100%' justify='center' align='center'>
      <LayoutBox width='60px'>
        <Tag data-testid={generateId('tag')} variant={TagVariant.info} text='hashtag' hashtag />
      </LayoutBox>
      <Tag data-testid={generateId('tag')} variant={TagVariant.veryLow} text='hashtag and icon' hashtag iconRight={pencilSVG} />
      <Tag data-testid={generateId('tag')} variant={TagVariant.low} text='hashtag and onclick' hashtag onClick={noop} />
      <Tag data-testid={generateId('tag')} variant={TagVariant.medium} text='onclick' onClick={noop} />
      <Tag
        data-testid={generateId('tag')}
        variant={TagVariant.high}
        text='icon and onclick'
        iconRight={pencilSVG}
        onClick={noop}
      />
      <Tag
        data-testid={generateId('tag')}
        variant={TagVariant.critical}
        text='icon, hashtag, and onclick'
        iconRight={pencilSVG}
        hashtag
        onClick={noop}
      />
    </LayoutBox>

    <DividerHorizontal color='var(--bs-primary)' />
    <HeadlineTertiary>With other components:</HeadlineTertiary>
    <LayoutBox direction='row' gap='1rem' width='100%' height='100%' justify='center' align='center'>
      <Tooltip
        placement={PopoverPlacement.Bottom}
        text='Tooltip'
      >
        <Tag
          data-testid={generateId('tag')}
          variant={TagVariant.high}
          text='with a tooltip'
          iconRight={pencilSVG}
        />
      </Tooltip>
    </LayoutBox>
    <DividerHorizontal color='var(--bs-primary)' />
    <HeadlineTertiary>In Table:</HeadlineTertiary>
    <LayoutBox direction='row' gap='1rem' width='100%' height='100%' justify='center' align='center'>
      <Tag data-testid={generateId('tag')} inTable variant={TagVariant.info} text='Hash Tag' hashtag />
      <Tag data-testid={generateId('tag')} inTable variant={TagVariant.veryLow} text='With icon' iconRight={pencilSVG} />
      <Tag data-testid={generateId('tag')} inTable variant={TagVariant.low} text='High' />
      <Tag data-testid={generateId('tag')} inTable variant={TagVariant.medium} text='Information' />
    </LayoutBox>
  </LayoutBox>
)

export const TagByDesign = TagTemplate.bind({})
TagByDesign.args = {
  text: 'Tag',
}
