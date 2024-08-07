import { StoryFn as Story, Meta } from '@storybook/react'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'



import { PopoverPlacement, Tooltip } from '../../molecules'
import { CollapsibleContainer as CollapsibleContainerBox, LayoutBox } from '../../container'
import { HeadlineTertiary } from '../text'
import { DividerHorizontal } from '../../dividers'
import { generateId, mapSerReplacer, noop } from '../../../../utils'

import { Toggle, ToggleProps } from './Toggle'


export default {
  title: 'Base Component/atoms/Toggle',
  component: Toggle,
} as Meta

class ShadowDomContainer extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  safeAppendChildren(): void {
    if (this.children) {
      while (this.firstChild) {
        this.shadowRoot?.appendChild(this.firstChild)
      }
    }
  }

  connectedCallback(): void {
    this.safeAppendChildren()
  }
}

customElements.get('shadow-dom-container') || customElements.define('shadow-dom-container', ShadowDomContainer)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'shadow-dom-container': any
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ToggleTemplate: Story<ToggleProps> = ({ id, ...args }) => {
  const [values, setValues] = useState(new Map([
    ['toggle0', false],
    ['toggle1', false],
    ['toggle2', true],
    ['toggle3', true],
    ['toggle4', false],
    ['toggle5', true],
  ]))

  const changeHandler = useCallback((event: ChangeEvent) => {
    setValues((prevValues) => {
      prevValues.set(event.target.id, (event.target as HTMLInputElement).checked)
      return new Map(Array.from(prevValues))
    })
  }, [])

  const toggleRef1 = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // either attach onChange  as property on the element
    // toggleRef1.current?.onChange = (event) => {
    //   alert(`toggleRef1 onChange, ${event}`)
    // }

    // or listner to change event
    toggleRef1.current?.addEventListener('change', (event) => {
      alert(`toggleRef1 EventListener change, ${event}`)
    }, true)
  }, [])

  return (
    <LayoutBox width='100%' direction='column' height='100%' justify='center' align='center' gap='1rem'>
      <HeadlineTertiary>Toggle:</HeadlineTertiary>
      <LayoutBox direction='row' gap='1rem' width='100%' height='100%' justify='center' align='center'>
        <Toggle
          data-testid={generateId('toggle', true, 0)}
          id='toggle0'
          {...args}
          onChange={changeHandler}
          checked={values.get('toggle0')}
        />
      </LayoutBox>
      <DividerHorizontal color='var(--bs-primary)' />
      <HeadlineTertiary>Checked and Disabled states:</HeadlineTertiary>
      <LayoutBox direction='row' gap='1rem' width='300px' height='100%' justify='center' align='center'>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '10px' }}>
          <tr>
            <th>Checked</th>
            <th>Disabled</th>
            <th>Toggle</th>
          </tr>
          <tr>
            <td>{(!!values.get('toggle1')).toString()}</td>
            <td>false</td>
            <td>
              <Toggle
                id='toggle1'
                disabled={false}
                onChange={changeHandler}
                checked={values.get('toggle1')}
                data-testid={generateId('toggle')}
              />
            </td>
          </tr>
          <tr>
            <td>{(!!values.get('toggle2')).toString()}</td>
            <td>false</td>
            <td>
              <Toggle
                id='toggle2'
                disabled={false}
                onChange={changeHandler}
                checked={values.get('toggle2')}
                data-testid={generateId('toggle')}
              />
            </td>
          </tr>
          <tr>
            <td>{(!!values.get('toggle3')).toString()}</td>
            <td>true</td>
            <td>
              <Toggle
                id='toggle3'
                disabled
                onChange={changeHandler}
                checked={values.get('toggle3')}
                data-testid={generateId('toggle')}
              />
            </td>
          </tr>
          <tr>
            <td>{(!!values.get('toggle4')).toString()}</td>
            <td>true</td>
            <td>
              <Toggle
                id='toggle4'
                disabled
                onChange={changeHandler}
                checked={values.get('toggle4')}
                data-testid={generateId('toggle')}
              />
            </td>
          </tr>
        </table>
      </LayoutBox>
      <DividerHorizontal color='var(--bs-primary)' />
      <HeadlineTertiary>With other components:</HeadlineTertiary>
      <LayoutBox direction='row' gap='1rem' width='100%' height='100%' justify='center' align='center'>
        with tooltip:
        <Tooltip
          placement={PopoverPlacement.Bottom}
          text='Tooltip'
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 20],
              },
            },
          ]}
        >
          <Toggle id='toggle5' onChange={changeHandler} checked={values.get('toggle5')} data-testid={generateId('toggle')} />
        </Tooltip>
      </LayoutBox>
      <CollapsibleContainerBox collapsed>
        <pre>{JSON.stringify(values, mapSerReplacer, 2)}</pre>
      </CollapsibleContainerBox>
    </LayoutBox>
  )
}

export const ToggleBase = ToggleTemplate.bind({})
ToggleBase.args = {
  disabled: false,
  checked: true,
  onChange: noop,
}
