// TODO if needed for decorators
// import 'reflect-metadata'
// import 'whatwg-fetch'
import React from 'react'
import { configure } from '@testing-library/react'

global.React = React

configure((existingConfig) => ({
  ...existingConfig,
  getElementError: (message): Error => new Error(message),
}))
