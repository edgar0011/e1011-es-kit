import { useEffect } from 'react'


const windowMatchMediaChangeEventType = 'change'

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

export const useThemePreference = (
  getHtmlElement: () => HTMLElement = (): HTMLElement => document.body,
  switchCallback: (isDark: boolean) => void = (isDark: boolean): boolean => isDark,
): void => {
  useEffect(() => observeThemePreference(getHtmlElement, switchCallback), [getHtmlElement, switchCallback])
}


export const baseThemes: {
  dark: string
  light: string
} = {
  dark: 'theme-dark',
  light: 'theme-light',
}

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

export const updateColorTheme = (isDark?: boolean, htmlElement?: HTMLElement): void => {
  let resolvedIsDark: boolean = isDark || false

  if (typeof document !== 'undefined' && isDark === undefined) {
    resolvedIsDark = document.body.classList.contains(baseThemes.dark)
  }
  switchColorTheme(resolvedIsDark, htmlElement || document.body)
}
