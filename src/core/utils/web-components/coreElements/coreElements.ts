

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
  let resolvedAttrValue: string | boolean | null = attrValue

  if (resolvedAttrValue === 'true' || resolvedAttrValue === 'false') {
    resolvedAttrValue = resolvedAttrValue === 'true'
  }

  const attrValueDefined = (resolvedAttrValue !== undefined && resolvedAttrValue !== null)

  if (attrValueDefined && (
    overrideProperty || component[attributeName] === undefined || component[attributeName] === null
  )) {
    // eslint-disable-next-line no-param-reassign
    component[attributeName] = valueMap ? valueMap(resolvedAttrValue) : resolvedAttrValue
  }

  return attrValueDefined
}


export const stringArrayParser = (value: string) => JSON.parse(value) as string[]

export const stringObjectParser = (value: string) => JSON.parse(value) as Record<string, unknown>
