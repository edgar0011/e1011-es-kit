import { delay } from '../helpers'

import { Model } from './convert'

describe('timing decorator', () => {
  const model = new Model()

  it('timing decorator basic', async () => {
    expect.assertions(1)
    await delay(1000)
    const validation = model.validate({ name: 'dataToValidate' })
    console.log('validation')
    console.log(validation)
    expect(validation).toBeFalsy()
  })

  it('timing decorator basic2', async () => {
    expect.assertions(1)
    await delay(1000)
    const msgResult = model.message('Jest spies tests')
    console.log('msgResult')
    console.log(msgResult)
    expect(msgResult).toEqual('Jest spies tests')
  })
})
