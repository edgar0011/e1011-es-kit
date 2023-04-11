export default {
  moduleNameMapper: {
    // eslint-disable-next-line max-len
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|pdf)$': '<rootDir>/test/file-mock.js',
    '^lodash-es$': 'lodash',
    '^lodash-es/(.*)': 'lodash/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(css|less|scss|sass)\\?inline$': 'identity-obj-proxy',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^screens/(.*)$': '<rootDir>/src/screens/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  moduleDirectories: [
    'node_modules',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es|lit|@lit|lit-html|lit-element)/*)',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  verbose: true,
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  preset: 'ts-jest/presets/js-with-ts',
  transform: {
    '^.+\\.jsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  setupFiles: [
    '<rootDir>/test/testSetup.js',
  ],
}
