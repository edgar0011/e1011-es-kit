export const mapSerReplacer
= (key: string, value: unknown): unknown | { dataType: string; value: Array<unknown>} => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    }
  }
  return value
}

export type TClassName = string | boolean | null | undefined
export const classNames = (...classes: TClassName[]): string => classes
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



type GeneratorIdCallable = (token: string, increment?: boolean, forcedValue?: number | undefined) => string
type GenerateId = { tokens?: Record<string, number | null | undefined> } & GeneratorIdCallable

export const generateId: GenerateId = (
  token: string,
  increment = true,
  forcedValue: number | undefined = undefined,
) => {
  generateId.tokens = generateId.tokens || {}

  if (forcedValue !== undefined && forcedValue !== null) {
    generateId.tokens[token] = forcedValue
    return `${token}${generateId?.tokens?.[token] as number}`
  }

  const noValue = generateId?.tokens[token] === undefined || generateId?.tokens[token] === null

  generateId.tokens[token] = generateId.tokens[token] || 0

  if (noValue) {
    return `${token}${0}`
  }

  if (increment) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    generateId.tokens[token] += 1

    return `${token}${generateId?.tokens?.[token] as number}`
  }

  return `${token}${generateId?.tokens?.[token] as number}`
}

type FAnchorClick = { aElement?: HTMLAnchorElement | null }
  & ((href: string, target?: string, remove?: boolean) => void)

export const anchorClick: FAnchorClick = (href: string, target = '_top', remove = false): HTMLAnchorElement | null => {
  anchorClick.aElement = anchorClick.aElement || document.createElement('a')

  const { aElement } = anchorClick

  aElement.setAttribute('href', href)
  aElement.setAttribute('target', target)

  aElement.dataset.date = `${Date.now()}`
  aElement.click()
  if (remove) {
    aElement.remove()
    anchorClick.aElement = null
  }

  return aElement
}



export type NoopEvent = {
  preventDefault?: () => void
  stopPropagation?: () => void
  stopImmediatePropagation?: () => void
} | Event

export const noop = (event?: NoopEvent): void => {
  event?.preventDefault?.()
  event?.stopPropagation?.()
  event?.stopImmediatePropagation?.()
}
