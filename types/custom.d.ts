type ReactHookFormRef =
  string | RefObject<HTMLInputElement> | ((instance: HTMLInputElement | null) => void) | null | undefined
