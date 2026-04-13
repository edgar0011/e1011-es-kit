/**
 * @jest-environment jsdom
 */

/**
 * Export inventory tests — contract for the library's public API.
 * These tests ensure that all expected named exports exist and have the correct type,
 * so that a build-tool migration (e.g. Rollup → Vite) can be verified.
 */

/* ------------------------------------------------------------------ */
/*  Hooks                                                             */
/* ------------------------------------------------------------------ */
// eslint-disable-next-line import/order
import * as hooks from '../core/hooks'

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */
// eslint-disable-next-line import/order
import * as constants from '../core/constants'

/* ------------------------------------------------------------------ */
/*  Utils — helpers                                                   */
/* ------------------------------------------------------------------ */
// eslint-disable-next-line import/order
import * as utils from '../core/utils'

/* ------------------------------------------------------------------ */
/*  UI                                                                */
/* ------------------------------------------------------------------ */
import * as ui from '../core/ui'

describe('hooks entry point', () => {
  const expectedFunctions = [
    'useApi',
    'useToggle',
    'useToggle2',
    'useOutsideClick',
    'useResize',
    'useClassNames',
    'useParseProps',
    'useThemePreference',
    'useAnimation',
    'useIntersectionObserver',
    'useTimeoutFn',
    'useStore',
    'useStoreApi',
    'usePeregrineMQ',
  ]

  it('exports all expected hooks as functions', () => {
    expect(Object.keys(hooks)).toEqual(expect.arrayContaining(expectedFunctions))
    expectedFunctions.forEach((name) => {
      expect(typeof (hooks as Record<string, unknown>)[name]).toBe('function')
    })
  })
})

describe('constants entry point', () => {
  it('exports EventName, KeyCode, Alerts enums', () => {
    expect(Object.keys(constants)).toEqual(
      expect.arrayContaining(['EventName', 'KeyCode', 'Alerts']),
    )
  })

  it('EventName, KeyCode, Alerts are objects (enums)', () => {
    expect(typeof constants.EventName).toBe('object')
    expect(typeof constants.KeyCode).toBe('object')
    expect(typeof constants.Alerts).toBe('object')
  })
})

describe('utils entry point', () => {
  describe('text/value helpers', () => {
    const expectedHelpers = [
      'toLowerCase',
      'toUpperCase',
      'removeWhitespaces',
      'fileNameExt',
      'normalizeString',
      'findStringInText',
      'escapeRegExp',
      'truncateText',
      'sanitizeId',
      'sanitizePathId',
      'numberDefined',
      'restrictNumberInLimits',
      'numberOperation',
      'incerementValue',
      'decrementValue',
      'setValue',
    ]

    it('exports all text/value helper functions', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expectedHelpers))
      expectedHelpers.forEach((name) => {
        expect(typeof (utils as Record<string, unknown>)[name]).toBe('function')
      })
    })
  })

  describe('async/timing helpers', () => {
    const expected = [
      'nestedTernary',
      'memoize',
      'memoizeComplex',
      'memoizer',
      'debounce',
      'delay',
      'isFunctionAsync',
      'cancelableSetInterval',
      'cancelableSetTimeout',
    ]

    it('exports all async/timing helpers', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
      expected.forEach((name) => {
        expect(typeof (utils as Record<string, unknown>)[name]).toBe('function')
      })
    })
  })

  describe('object/file/email helpers', () => {
    const expected = [
      'duplicatesInArray',
      'formatJsonString',
      'formatObj',
      'formatObj2',
      'chunkArray',
      'arrayToObjectTree',
      'isBirthNumberValid',
      'parseCSVdata',
      'validateCSVFile',
      'cleanCsvLines',
      'formatFilePath',
      'regexBuilder',
      'emailMatch',
      'emailMatcher',
    ]

    it('exports all object/file/email helpers', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('UI helpers', () => {
    const expected = [
      'mapSerReplacer',
      'classNames',
      'parseProps',
      'generateId',
      'anchorClick',
      'noop',
      'getBaseThemes',
      'setThemeClassNames',
      'switchColorTheme',
      'updateColorTheme',
      'observeThemePreference',
    ]

    it('exports all UI helper functions', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
      expected.forEach((name) => {
        expect(typeof (utils as Record<string, unknown>)[name]).toBe('function')
      })
    })
  })

  describe('text sanitization helpers', () => {
    const expected = ['defaultSanitizeConfig', 'sanitizeHtml', 'composeId']

    it('exports sanitize/compose helpers', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
      expect(typeof (utils as Record<string, unknown>).sanitizeHtml).toBe('function')
      expect(typeof (utils as Record<string, unknown>).composeId).toBe('function')
      expect(typeof (utils as Record<string, unknown>).defaultSanitizeConfig).toBe('object')
    })
  })

  describe('date helpers', () => {
    const expected = [
      'getTimeFromNowOriginal',
      'getTimeFromNow',
      'getTimeTo',
      'getDateTime',
      'dateRangeFormat',
    ]

    it('exports date helper functions', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
      expected.forEach((name) => {
        expect(typeof (utils as Record<string, unknown>)[name]).toBe('function')
      })
    })
  })

  describe('date helpers from helpers/date', () => {
    const expected = [
      'getDate',
      'formatDateToTimestamp',
      'DATE_FORMAT',
      'DATE_TIME_FORMAT',
      'formatDate',
      'formatDateTime',
    ]

    it('exports helpers/date functions and constants', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('device info', () => {
    it('exports getDeviceId', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(['getDeviceId']))
      expect(typeof (utils as Record<string, unknown>).getDeviceId).toBe('function')
    })
  })

  describe('keyExtractor', () => {
    it('exports keyExtractor and keyExtractorFunction', () => {
      expect(Object.keys(utils)).toEqual(
        expect.arrayContaining(['keyExtractor', 'keyExtractorFunction']),
      )
      expect(typeof (utils as Record<string, unknown>).keyExtractorFunction).toBe('function')
    })
  })

  describe('webComponents', () => {
    const expected = ['ced', 'customElementDefine', 'createResolveAttribute', 'resolveAttributes']

    it('exports web component utilities', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
      expected.forEach((name) => {
        expect(typeof (utils as Record<string, unknown>)[name]).toBe('function')
      })
    })
  })

  describe('appState/store', () => {
    const expected = ['createStore', 'createDataStore', 'canSetStateMerge', 'getSetStateMerge']

    it('exports store creation functions', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
      expected.forEach((name) => {
        expect(typeof (utils as Record<string, unknown>)[name]).toBe('function')
      })
    })
  })

  describe('appState/peregrineMQ', () => {
    const expected = ['PeregrineMQ', 'PeregrineMQClearError', 'peregrineMQInstance', 'NON_EXISTENT_CHANNEL']

    it('exports PeregrineMQ class and instance', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
      expect(typeof (utils as Record<string, unknown>).PeregrineMQ).toBe('function')
      expect(typeof (utils as Record<string, unknown>).PeregrineMQClearError).toBe('function')
      expect(typeof (utils as Record<string, unknown>).peregrineMQInstance).toBe('object')
      expect(typeof (utils as Record<string, unknown>).NON_EXISTENT_CHANNEL).toBe('string')
    })
  })

  describe('appState/stateMachine', () => {
    const expected = [
      'TinyStateMachineEventType',
      'TinyStateMachineEvent',
      'TinyStateMachineState',
      'TinyStateMachine',
      'createStates',
      'stateIterator',
    ]

    it('exports state machine classes and utilities', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(expected))
      expect(typeof (utils as Record<string, unknown>).TinyStateMachine).toBe('function')
      expect(typeof (utils as Record<string, unknown>).TinyStateMachineState).toBe('function')
      expect(typeof (utils as Record<string, unknown>).TinyStateMachineEvent).toBe('function')
      expect(typeof (utils as Record<string, unknown>).createStates).toBe('function')
      expect(typeof (utils as Record<string, unknown>).stateIterator).toBe('function')
    })
  })

  describe('array extensions', () => {
    it('exports ArrayFirst and ArrayLast', () => {
      expect(Object.keys(utils)).toEqual(
        expect.arrayContaining(['ArrayFirst', 'ArrayLast']),
      )
    })
  })

  describe('Operation enum', () => {
    it('exports Operation enum', () => {
      expect(Object.keys(utils)).toEqual(expect.arrayContaining(['Operation']))
      expect(typeof (utils as Record<string, unknown>).Operation).toBe('object')
    })
  })
})

describe('ui entry point', () => {
  describe('style utilities', () => {
    const expected = [
      'defaultFontSize',
      'setDefaultFontSize',
      'pxToRem',
      'resolveStyleValue',
      'toHex',
      'convertHex',
      'convertRGB',
      'calculatePercColor',
      'calculateColors',
    ]

    it('exports all style utility functions', () => {
      expect(Object.keys(ui)).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('CommonProps types (runtime exports)', () => {
    // CommonProps, CommonPropsExact, ForwardedRefContainer are type-only, no runtime exports expected
    // Just verify ui module loads without error
    it('ui module loads successfully', () => {
      expect(ui).toBeDefined()
    })
  })
})
