import React from 'react'
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/styles/common.scss'
import { ErrorBoundary } from '../src/core/ui/components/error/ErrorBoundary'

// https://github.com/storybookjs/storybook/issues/17831
window.React = React

export const parameters = {
  actions: { argTypesRegex: "^onAction[A-Z].*" },
  docs: { source: { type: 'code' } },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // themes: {
  //   default: 'Dark',
  //   clearable: false,
  //   list: [
  //     { name: 'Dark', class: 'cui-theme-dark', color: '#4a4d4e' },
  //     { name: 'Light', class: 'cui-theme-light', color: '#eff2f4' },
  //   ],
  // },
  options: {
    storySort: {
      order: [
        'e1011',
        'Core UI',
        'core-vite',
        [
          'quarks',
          'atoms',
          'molecules',
          'compounds',
          'screens'
        ],
        'Examples'
      ],
    },
  },
}


const preview: Preview = {
  parameters,
  decorators: [
    (Story) => (
      <ErrorBoundary>
        <div data-testid='ui-app-story'>
          <Story />
        </div>
      </ErrorBoundary>
    ),
    withThemeByClassName({
      themes: {
        Light: 'cui-theme-light',
        Dark: 'cui-theme-dark',
      },
      defaultTheme: 'Light',
    }),
  ],
};

export default preview;
