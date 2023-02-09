

/* custom elements define */
export const ced = (name: string) => (
  componentClass: typeof HTMLElement,
) => {
  customElements.get(name) || customElements.define(name, componentClass)
}

export const customElementDefine = ced
