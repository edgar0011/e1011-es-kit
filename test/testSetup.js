// TODO if needed for decorators
// import 'reflect-metadata'
// import 'whatwg-fetch'
import React from 'react'
import { configure } from '@testing-library/react'

global.React = React



configure((existingConfig) => {
  console.log('existingConfig')
  console.log(existingConfig)
  return {
    ...existingConfig,
    // getElementError: (message) => new Error(message),
  }
})
