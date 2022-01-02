import { delay } from './helpers'
// import { timing } from './timing'

class Model {
  name: string = 'Model'

  // @timing
  validate(data: Record<string, unknown>) {
    console.log(this.name, data)
    return true
  }
}

describe.skip('timing decorator', () => {
  const model = new Model()

  it.skip('timing decorator basic', async () => {
    expect.assertions(1)
    await delay(1000)
    const validation = model.validate({ name: 'dataToValidate' })
    expect(validation).toBeTruthy()
  })
})
