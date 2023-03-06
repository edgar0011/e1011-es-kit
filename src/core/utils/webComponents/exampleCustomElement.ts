import { ced } from './webComponent.utils'

@ced('custom-title')
export class CustomTitle extends HTMLElement {
  text: string

  static get observedAttributes() {
    return ['text']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.innerHTML = '<div class=\'title\'><b>Title</b><i><slot id=\'subtitle\'></slot></i></div>'
  }

  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    switch (attrName) {
      case 'text': {
        this.text = newVal
        const mainElement = this.shadowRoot?.querySelector('b') as HTMLElement

        if (mainElement) {
          mainElement.innerText = newVal
        }
        break
      }
      default: {
        break
      }
    }
  }
}
