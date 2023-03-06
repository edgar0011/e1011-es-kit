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
  // eslint-disable-next-line default-param-last
  overrideProperty = true,
  valueMap?: (value: unknown) => unknown,
): boolean => {
  const attrValue = component.getAttribute(attributeName)
  const attrValueDefined = attrValue !== undefined

  if (overrideProperty && attrValueDefined && component[attributeName] === undefined) {
    // eslint-disable-next-line no-param-reassign
    component[attributeName] = valueMap ? valueMap(attrValue) : attrValue
  }

  return attrValueDefined
}

export const resolveAttributes = (
  component: Element & Record<string, any>,
  attributes: ({ name: string; override: boolean; valueMap?: (value: unknown) => unknown } | string)[],
) => {
  const resolver = createResolveAttribute(component)

  attributes.forEach((attribute) => {
    if (typeof attribute === 'string') {
      resolver(attribute)
    } else {
      const { name, override, valueMap } = attribute

      resolver(name, override, valueMap)
    }
  })
}
