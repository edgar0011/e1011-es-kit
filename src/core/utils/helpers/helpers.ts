export const delay = (delay: number): Promise<string> => new Promise((resolve) => {
  setTimeout(() => resolve(`delayed: ${delay}`), delay)
})
