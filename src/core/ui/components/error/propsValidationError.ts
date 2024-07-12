export class PropsValidationError extends Error {
  constructor(message:string) {
    super(message)
    this.name = 'PropsValidationError'
  }
}
