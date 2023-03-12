export const cancelableSetInterval = (func: () => void, delay = 100) => {
  const timeoutInterval = setInterval(func, delay)

  return () => clearInterval(timeoutInterval)
}

export const cancelableSetTimeout = (func: () => void, delay = 100) => {
  const timeoutInterval = setTimeout(func, delay)

  return () => clearTimeout(timeoutInterval)
}
