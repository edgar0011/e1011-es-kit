export const cancelableSetInterval = (func: () => void, delay = 100): () => void => {
  const timeoutInterval = setInterval(func, delay)

  return (): void => clearInterval(timeoutInterval)
}

export const cancelableSetTimeout = (func: () => void, delay = 100): () => void => {
  const timeoutInterval = setTimeout(func, delay)

  return (): void => clearTimeout(timeoutInterval)
}
