import { useEffect } from 'react'


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

/**
 * Custom hook to use theme preference in a React component.
 * @param {() => HTMLElement} [getHtmlElement] - Function to get the HTML element to which the theme will be applied.
 * @param {(isDark: boolean) => void} [switchCallback] - Callback function to execute when the theme changes.
 */
export const useThemePreference = (
  getHtmlElement: () => HTMLElement = (): HTMLElement => document.body,
  switchCallback: (isDark: boolean) => void = (isDark: boolean): boolean => isDark,
): void => {
  useEffect(() => observeThemePreference(getHtmlElement, switchCallback), [getHtmlElement, switchCallback])
}

/**
 * Type definition for theme map.
 * @typedef {Object} ThemeMap
 * @property {string} dark - CSS class for the dark theme.
 * @property {string} light - CSS class for the light theme.
 */
type ThemeMap = {
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
