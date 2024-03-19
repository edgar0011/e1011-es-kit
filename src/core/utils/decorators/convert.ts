type Target = string | number | unknown
type Decorator = (
  target: Target, name: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>



export const logger = <TClass>(
  clazz: TClass,
): TClass => {
  console.log('logger, target', clazz)
  return clazz
}



export const convertor = (
  target: Target, name: string, descriptor: TypedPropertyDescriptor<any>,
): TypedPropertyDescriptor<any> => {
  console.log(descriptor)
  return descriptor
}

export const converting
= (flag?: string): Decorator => (
  target: Target, name: string, descriptor: TypedPropertyDescriptor<any>,
): TypedPropertyDescriptor<any> => {
  console.log('timing decorator')
  console.log('target')
  console.log(target)
  console.log('name')
  console.log(name)
  console.log('descriptor')
  console.log(descriptor)
  if (flag === 'invert') {
    const original = descriptor.value
    const newValue = function newValue(...args: unknown[]): unknown {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return !original.apply(this, args)
    }

    return Object.defineProperty(target, name, {
      ...descriptor,
      value: newValue,
    }) as TypedPropertyDescriptor<any>
    // descriptor.value = newValue
  }
  return descriptor
}
@logger<typeof Model>
export class Model {
  name = 'Model'

  @converting('invert')
  validate(data: Record<string, unknown>): boolean {
    console.log('validate', this.name, data)
    return true
  }

  @convertor
  message(msg: string): string {
    console.log('message', this.name, msg)
    return msg
  }
}
