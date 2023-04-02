import { ced, resolveAttributes } from '../../../utils/webComponents/webComponent.utils'

import classes from './icon.module.scss'



const template = document.createElement('template')

template.innerHTML = '<span class="icon-base"></span>'

export type IconBaseWCType = {
  iconUrl?: string
  minWidth?: string
  minHeight?: string
  width?: string
  height?: string
  size?: string
  fontSize?: string
  color?: string
  className?: string
}

@ced('icon-base')
export class VCIcon extends HTMLElement {
  content: string | null

  mainElement: HTMLElement

  iconUrl?: string | null

  minWidth?: string | null

  minHeight?: string | null

  width?: string | null

  height?: string | null

  size?: string | null

  fontSize?: string | null

  color?: string | null

  static get observedAttributes() {
    return ['iconUrl', 'minWidth', 'minHeight', 'width', 'height', 'size', 'fontSize', 'color', 'className']
  }

  connectedCallback() {
    if (this.innerHTML) {
      this.content = this.content || this.innerHTML || this.getAttribute('content')
    }

    this.innerHTML = template.innerHTML

    resolveAttributes(this, VCIcon.observedAttributes)

    this.render()
  }

  attributeChangedCallback(attrName: string, oldVal: string | number | null, newVal: string | number | null) {
    if (attrName === 'className') {
      this.className = (newVal as string) || ''
      if (this.className) {
        this.classList.remove(this.className)
        this.classList.add(this.className)
      }
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
    this.classList.add(classes['icon-base-parent'])
    this.mainElement.classList.add(classes['icon-base'])

    const styles = {
      '--min-width': this.minWidth || this.size || this.width || 'auto',
      '--min-height': this.minHeight || this.size || this.height || 'auto',
      '--width': this.size || this.width,
      '--height': this.size || this.height,
      ...(this.fontSize ? { 'font-size': this.fontSize || 'unset' } : {}),
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

export const VCIconBase = {
  VCIconBase: VCIcon,
}
