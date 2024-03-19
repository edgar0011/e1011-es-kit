import { is } from 'ramda'

// fix of Vite 5 new way of handling assets
// https://github.com/vitejs/vite/pull/2909
// https://github.com/vitejs/vite/blob/77d5165e2f252bfecbb0eebccc6f04dc8be0c5ba/packages/vite/src/node/plugins/asset.ts#L419
export const unifyIconUrl = (iconUrl: string): string => {
  if (!iconUrl || !is(String, iconUrl) || !iconUrl
  || iconUrl?.includes('.svg') || iconUrl?.includes('data:image/svg+xml;base64')) {
    return iconUrl
  }

  const unifiedIconUrl = iconUrl?.replaceAll('/\\s+/g', ' ')
    .replaceAll('\'', '"')
    .replaceAll('%25', '%')
    .replaceAll('%23', '#')
    .replaceAll('%3c', '<')
    .replaceAll('%3e', '>')
    .replaceAll('%20', ' ')
    .replaceAll('data:image/svg+xml,', '')

  return `data:image/svg+xml;base64,${btoa(unifiedIconUrl)}`
}
