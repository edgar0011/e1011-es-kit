import _sanitize from 'sanitize-html'

export const defaultSanitizeConfig = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'span', 'li', 'ul', 'div', 'h1', 'h2', 'h3', 'h4', 'img'],
  allowedAttributes: {
    a: ['href', 'target', 'style', 'class', 'onclick'],
    '*': ['href', 'target', 'style', 'align', 'alt', 'center', 'bgcolor', 'style', 'src'],
  },
}

export const sanitizeHtml
  = (
    text: string,
    sanitizeConfig?: typeof defaultSanitizeConfig,
  ): ReturnType<typeof _sanitize> => _sanitize(text, sanitizeConfig || defaultSanitizeConfig)

export const composeId = (text: string): string => text?.toLowerCase?.()?.replace(/\s+/g, '-')
