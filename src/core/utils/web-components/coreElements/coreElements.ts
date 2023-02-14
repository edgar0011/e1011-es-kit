

/* custom elements define */
export const ced = (name: string) => (
  componentClass: typeof HTMLElement,
) => {
  customElements.get(name) || customElements.define(name, componentClass)
}

export const customElementDefine = ced



export const createResolveAttribute = (
  component: Element & Record<string, any>,
) => (
  attributeName: string,
  overrideProperty = true,
): boolean => {
  const attrValue = component.getAttribute(attributeName)

  if (overrideProperty && !!attrValue && !component[attributeName]) {
    // eslint-disable-next-line no-param-reassign
    component[attributeName] = attrValue
  }

  return !!attrValue
}
