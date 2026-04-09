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

/**
 * Type definition for theme map.
 * @typedef {Object} ThemeMap
 * @property {string} dark - CSS class for the dark theme.
 * @property {string} light - CSS class for the light theme.
 */
export type ThemeMap = {
  dark: string
  light: string
}

let baseThemes: ThemeMap = {
  dark: 'theme-dark',
  light: 'theme-light',
}

/**
 * Gets the base themes.
 * @returns {ThemeMap} The current base themes.
 */
export const getBaseThemes = (): ThemeMap => baseThemes

/**
 * Sets the base theme class names.
 * @param {ThemeMap} themes - Object containing the CSS classes for dark and light themes.
 */
export const setThemeClassNames = (themes: ThemeMap): void => {
  baseThemes = themes
}

/**
 * Switches the color theme of the document.
 * @param {boolean} isDark - Flag to determine if the dark theme should be applied.
 * @param {HTMLElement} [htmlElement] - The HTML element to which the theme will be applied.
 * @param {boolean} [findShadows=true] - Flag to determine if shadow DOM elements should also be themed.
 */
export const switchColorTheme = (isDark: boolean, htmlElement?: HTMLElement, findShadows = true): void => {
  const oldClass = isDark ? baseThemes.light : baseThemes.dark
  const newClass = isDark ? baseThemes.dark : baseThemes.light

  if (htmlElement) {
    htmlElement.classList.remove(oldClass)
    htmlElement.classList.remove(newClass)
    htmlElement.classList.add(newClass)
  }

  if (typeof document !== 'undefined') {
    document.querySelectorAll(`.${oldClass}`).forEach((element) => {
      element.classList.add(`.${newClass}`)
      element.classList.remove(`.${oldClass}`)
    })

    if (findShadows) {
      document.querySelectorAll('.shadow-div').forEach((element) => {
        element.shadowRoot?.querySelector(`.${oldClass}`)?.classList.add(newClass)
        element.shadowRoot?.querySelector(`.${oldClass}`)?.classList.remove(oldClass)
      })

      document.querySelectorAll('esmf-wrapper').forEach((element) => {
        element.shadowRoot?.querySelector(`.${oldClass}`)?.classList.add(newClass)
        element.shadowRoot?.querySelector(`.${oldClass}`)?.classList.remove(oldClass)

        const firstChild: HTMLElement = element.shadowRoot?.childNodes[0] as HTMLElement

        if (firstChild) {
          firstChild.classList.add(newClass)
          firstChild.classList.remove(oldClass)
        }
      })
    }
  }
}

/**
 * Updates the color theme of the document.
 * @param {boolean} [isDark] - Optional flag to determine if the dark theme should be applied.
 * @param {HTMLElement} [htmlElement] - The HTML element to which the theme will be applied.
 */
export const updateColorTheme = (isDark?: boolean, htmlElement?: HTMLElement): void => {
  let resolvedIsDark: boolean = isDark || false

  if (typeof document !== 'undefined' && isDark === undefined) {
    resolvedIsDark = document.body.classList.contains(baseThemes.dark)
  }
  switchColorTheme(resolvedIsDark, htmlElement || document.body)
}

const windowMatchMediaChangeEventType = 'change'

/**
 * Observes the user's theme preference and applies the appropriate theme.
 * @param {() => HTMLElement} [getHtmlElement] - Function to get the HTML element to which the theme will be applied.
 * @param {(isDark: boolean) => void} [switchCallback] - Callback function to execute when the theme changes.
 * @returns {() => void} Function to stop observing the theme preference.
 */
export const observeThemePreference = (
  getHtmlElement: () => HTMLElement = (): HTMLElement => document.body,
  switchCallback: (isDark: boolean) => void = (isDark: boolean): boolean => isDark,
): () => void => {
  const switchColorThemeHandler = (isDark: boolean): void => {
    const htmlElement = getHtmlElement()

    switchColorTheme?.(isDark, htmlElement)
    switchCallback?.(isDark)
  }

  const changeDarkColorThemeHandler = (event: MediaQueryListEvent): void => {
    switchColorThemeHandler(event.matches)
  }

  const changeLightColorThemeHandler = (event: MediaQueryListEvent): void => {
    switchColorThemeHandler(!event.matches)
  }

  const isDark = window.matchMedia('(prefers-color-scheme: dark)')

  try {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener(
      windowMatchMediaChangeEventType, changeDarkColorThemeHandler,
    )
    window.matchMedia('(prefers-color-scheme: light)').removeEventListener(
      windowMatchMediaChangeEventType, changeLightColorThemeHandler,
    )
  } catch (error) {
    console.error(`Error::observeThemePreference::removeEventListener: ${error}`)
  }

  switchColorThemeHandler(isDark?.matches)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
    windowMatchMediaChangeEventType, changeDarkColorThemeHandler,
  )
  window.matchMedia('(prefers-color-scheme: light)').addEventListener(
    windowMatchMediaChangeEventType, changeLightColorThemeHandler,
  )

  return () => {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener(
      windowMatchMediaChangeEventType, changeDarkColorThemeHandler,
    )
    window.matchMedia('(prefers-color-scheme: light)').removeEventListener(
      windowMatchMediaChangeEventType, changeLightColorThemeHandler,
    )
  }
}
