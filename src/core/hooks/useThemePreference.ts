import { useEffect } from 'react'

import { observeThemePreference } from '../utils/helpers/ui'

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
