export const noop = () => undefined


export const mapSerReplacer = (key: string, value: unknown) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    }
  }
  return value
}

export type TClassName = string | boolean | null | undefined
export const classNames = (...classes: TClassName[]) => classes
  .filter((className: TClassName) => (typeof className === 'string' && className !== undefined && className !== null))
  .filter(Boolean).join(' ')


export type PropsCategoriesType = {
  dataProps: Record<string, unknown>
  restProps: Record<string, unknown>
};

export const parseProps = (props: Record<string, unknown>):PropsCategoriesType => {
  const dataProps: Record<string, unknown> = {}
  const restProps: Record<string, unknown> = {}

  Object.entries(props).forEach(([key, value]) => {
    if (key.substr(0, 5) === 'data-' || key.substr(0, 4) === 'data') {
      dataProps[key] = value
    } else {
      restProps[key] = value
    }
  })
  return { dataProps, restProps }
}
