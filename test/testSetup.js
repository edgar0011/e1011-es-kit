// TODO if needed for decorators
// import 'reflect-metadata'
import 'whatwg-fetch'
import React from 'react'
import { configure } from '@testing-library/react'

global.React = React

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  Object.defineProperty(window, 'ResizeObserver', {
    value: jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    })),
  })
}

configure((existingConfig) => ({
  ...existingConfig,
  getElementError: (message): Error => new Error(message),
}))
