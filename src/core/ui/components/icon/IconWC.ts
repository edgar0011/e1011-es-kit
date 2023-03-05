import { ced } from '../../../utils/web-components/coreElements/coreElements'

import classes from './icon.module.scss'


const template = document.createElement('template')

template.innerHTML = '<span class="icon-base"></span>'


@ced('icon-base')
export default class IconBase extends HTMLElement {
  content: string | null

  mainElement: HTMLElement

  iconUrl?: string | null

  minWidth?: string | null

  minHeight?: string | null

  width?: string | null

  height?: string | null

  size?: string | null

  color?: string | null

  static get observedAttributes() {
    return ['iconUrl', 'minWidth', 'minHeight', 'width', 'height', 'size', 'color', 'className']
  }

  connectedCallback() {
    if (this.innerHTML) {
      this.content = this.content || this.innerHTML || this.getAttribute('content')
    }

    this.innerHTML = template.innerHTML

    this.iconUrl = this.iconUrl || this.getAttribute('iconUrl')
    this.minWidth = this.minWidth || this.getAttribute('minWidth')
    this.minHeight = this.minHeight || this.getAttribute('minHeight')
    this.width = this.width || this.getAttribute('width')
    this.height = this.height || this.getAttribute('height')
    this.size = this.size || this.getAttribute('size')
    this.color = this.color || this.getAttribute('color')
    this.className = (this.className || this.getAttribute('className')) as string

    this.render()
  }

  attributeChangedCallback(attrName: string, oldVal: string | number | null, newVal: string | number | null) {
    if (attrName === 'className') {
      this.className = (newVal as string) || ''
      if (this.className) {
        this.classList.remove(this.className)
        this.classList.add(this.className)
      }
      return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[attrName] = newVal
    this.render()
  }

  render = () => {
    this.mainElement = this.mainElement || this.querySelector('.icon-base') as HTMLElement
    if (!this.mainElement) {
      return
    }

    this.mainElement.classList.add(classes['icon-base'])

    const styles = {
      '--min-width': this.minWidth || 'unset',
      '--min-height': this.minHeight || 'unset',
      '--width': this.size || this.width || 'unset',
      '--height': this.size || this.height || 'unset',
      ...(this.size ? { 'font-size': this.size || 'unset' } : {}),
      ...(this.iconUrl ? { '--icon-url': `url(${this.iconUrl})` } : {}),
      ...(this.iconUrl ? { '--icon-color': this.color } : { '--icon-content-color': this.color }),
    }

    this.mainElement.innerHTML = this.iconUrl ? '' : (this.content || '')

    this.mainElement.setAttribute('style', Object.entries(styles).map(([key, value]) => `${key}: ${value};`).join(' '))
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'icon-base': any
    }
  }
}

export const IconBaseWC = {
  IconBaseWC: IconBase,
}
