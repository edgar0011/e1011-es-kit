import { classNames } from './ui'


describe('classNames', () => {
  it('should have proper classNames string', () => {
    const classes = classNames(
      'my-class',
      true && 'other-class',
      false && 'some-other-class',
      !null && 'some-other-class2',
      (true || false) ?? 'last-class',
      ...['external-class', 'external-class2'],
    )

    expect(classes).toBe('my-class other-class some-other-class2 external-class external-class2')
  })
})
