import { defaultSanitizeConfig, sanitizeHtml } from './text'


const customSanitizeConfig = {
  ...defaultSanitizeConfig,
  allowedAttributes: {
    ...defaultSanitizeConfig.allowedAttributes,
    a: ['target', 'style', 'class', 'onclick'],
    '*': ['target', 'style', 'align', 'alt', 'center', 'bgcolor', 'style', 'src'],
  },
}

describe('Text utils', () => {
  it.skip('should sanitize html text', () => {
    expect(sanitizeHtml(
      '<a data-items="[1,2,3]" href="www.google.com">Google</a>',
    )).toEqual('<a href="www.google.com">Google</a>')
  })


  it('should sanitize html text with custom config', () => {
    expect(sanitizeHtml(
      '<a data-items="[1,2,3]" href="www.google.com">Google</a>',
      customSanitizeConfig,
    )).toEqual('<a>Google</a>')
  })
})
