export const timing = (target: Record<string, unknown>, name: string, descriptor: Record<string, unknown>) => {
  console.log('timing decorator')
  console.log('target, name, descriptor')
  console.log(target, name, descriptor)
  return descriptor.value
}
