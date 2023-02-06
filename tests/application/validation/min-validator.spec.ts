import { MinValidator } from '@/application/validation'
import { MinError } from '@/application/errors'

describe('MinValidator', () => {
  it.each`
  field           | fieldname       | value           | min           | error
  ${'fieldname'}  | ${''}           | ${'any_value'}  | ${20}         | ${'empty'}
  ${'fieldname'}  | ${null}         | ${'any_value'}  | ${20}         | ${'null'}
  ${'fieldname'}  | ${undefined}    | ${'any_value'}  | ${20}         | ${'undefined'}
  ${'value'}      | ${'fieldname'}  | ${null}         | ${20}         | ${'null'}
  ${'value'}      | ${'fieldname'}  | ${undefined}    | ${20}         | ${'undefined'}
  ${'min'}        | ${'fieldname'}  | ${'any_value'}  | ${null}       | ${'null'}
  ${'min'}        | ${'fieldname'}  | ${'any_value'}  | ${undefined}  | ${'undefined'}
  ${'min'}        | ${'fieldname'}  | ${'any_value'}  | ${0}          | ${'0'}
  `('should throw if field $field is $error', ({ fieldname, value, min }) => {
    const sut = new MinValidator(fieldname, value, min)
    const error = sut.validate()
    expect(error).toEqual(new Error('MinValidator fields error'))
  })

  it.each`
  fieldname       | value           | min
  ${'fieldname'}  | ${'any_value'}  | ${15}
  ${'fieldname'}  | ${10}           | ${15}
  `('should return MinError if value is lower than min', ({ fieldname, value, min }) => {
    const sut = new MinValidator(fieldname, value, min)
    const error = sut.validate()
    expect(error).toEqual(new MinError(fieldname, min, (typeof value === 'number')))
  })

  it.each`
  fieldname       | value           | min
  ${'fieldname'}  | ${'any_value'}  | ${5}
  ${'fieldname'}  | ${10}           | ${5}
  `('should return undefined if value is lower than min', ({ fieldname, value, min }) => {
    const sut = new MinValidator(fieldname, value, min)
    const result = sut.validate()
    expect(result).toEqual(undefined)
  })
})
