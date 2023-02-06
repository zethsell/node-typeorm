import { MaxValidator } from '@/application/validation'
import { MaxError } from '@/application/errors'

describe('MaxValidator', () => {
  it.each`
  field           | fieldname       | value           | max           | error
  ${'fieldname'}  | ${''}           | ${'any_value'}  | ${20}         | ${'empty'}
  ${'fieldname'}  | ${null}         | ${'any_value'}  | ${20}         | ${'null'}
  ${'fieldname'}  | ${undefined}    | ${'any_value'}  | ${20}         | ${'undefined'}
  ${'value'}      | ${'fieldname'}  | ${null}         | ${20}         | ${'null'}
  ${'value'}      | ${'fieldname'}  | ${undefined}    | ${20}         | ${'undefined'}
  ${'max'}        | ${'fieldname'}  | ${'any_value'}  | ${null}       | ${'null'}
  ${'max'}        | ${'fieldname'}  | ${'any_value'}  | ${undefined}  | ${'undefined'}
  ${'max'}        | ${'fieldname'}  | ${'any_value'}  | ${0}          | ${'0'}
  `('should throw if field $field is $error', ({ fieldname, value, max }) => {
    const sut = new MaxValidator(fieldname, value, max)
    const error = sut.validate()
    expect(error).toEqual(new Error('MaxValidator fields error'))
  })

  it.each`
  fieldname       | value           | max
  ${'fieldname'}  | ${'any_value'}  | ${5}
  ${'fieldname'}  | ${10}           | ${5}
  `('should return MaxError if value is bigger than max', ({ fieldname, value, max }) => {
    const sut = new MaxValidator(fieldname, value, max)
    const error = sut.validate()
    expect(error).toEqual(new MaxError(fieldname, max, (typeof value === 'number')))
  })

  it.each`
  fieldname       | value           | max
  ${'fieldname'}  | ${'any_value'}  | ${20}
  ${'fieldname'}  | ${10}           | ${20}
  `('should return undefined if value is lower than max', ({ fieldname, value, max }) => {
    const sut = new MaxValidator(fieldname, value, max)
    const result = sut.validate()
    expect(result).toEqual(undefined)
  })
})
