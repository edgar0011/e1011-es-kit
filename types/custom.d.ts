type ReactHookFormRef =
  string | RefObject<HTMLInputElement> | ((instance: HTMLInputElement | null) => void) | null | undefined

declare module '*.svg' {
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.scss' {
  const content: Record<string, string>
  export default content
}


declare module '*.css' {
  const content: Record<string, string>
  export default content
}
