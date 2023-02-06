import { BetweenValidator } from '@/application/validation'
import { BetweenError } from '@/application/errors'

describe('BetweenValidator', () => {
  it.each`
  field           | fieldname       | value           | min             | max           | error
  ${'fieldname'}  | ${''}           | ${'any_value'}  | ${5}            | ${20}         | ${'empty'}
  ${'fieldname'}  | ${null}         | ${'any_value'}  | ${5}            | ${20}         | ${'null'}
  ${'fieldname'}  | ${undefined}    | ${'any_value'}  | ${5}            | ${20}         | ${'undefined'}
  ${'value'}      | ${'fieldname'}  | ${null}         | ${5}            | ${20}         | ${'null'}
  ${'value'}      | ${'fieldname'}  | ${undefined}    | ${5}            | ${20}         | ${'undefined'}
  ${'min'}        | ${'fieldname'}  | ${'any_value'}  | ${null}         | ${20}         | ${'null'}
  ${'min'}        | ${'fieldname'}  | ${'any_value'}  | ${undefined}    | ${20}         | ${'undefined'}
  ${'max'}        | ${'fieldname'}  | ${'any_value'}  | ${5}            | ${null}       | ${'null'}
  ${'max'}        | ${'fieldname'}  | ${'any_value'}  | ${5}            | ${undefined}  | ${'undefined'}
  ${'max min'}    | ${'fieldname'}  | ${'any_value'}  | ${20}           | ${5}          | ${'inverted'}
  `('should throw if field $field is $error', ({ fieldname, value, min, max }) => {
    const sut = new BetweenValidator(fieldname, value, min, max)
    const error = sut.validate()
    expect(error).toEqual(new Error('BetweenValidator fields error'))
  })

  it.each`
  fieldname       | value               | min     | max
  ${'fieldname'}  | ${'any_value'}      | ${15}   | ${20}
  ${'fieldname'}  | ${10}               | ${15}   | ${20}
  ${'fieldname'}  | ${'any_value_long'} | ${5}    | ${10}
  ${'fieldname'}  | ${25}               | ${15}   | ${20}
  `('should return BetweenError if value is out of range', ({ fieldname, value, min, max }) => {
    const sut = new BetweenValidator(fieldname, value, min, max)
    const error = sut.validate()
    expect(error).toEqual(new BetweenError(fieldname, min, max, (typeof value === 'number')))
  })

  it.each`
  fieldname       | value           | min     | max
  ${'fieldname'}  | ${'any_value'}  | ${5}    | ${20}
  ${'fieldname'}  | ${10}           | ${5}    | ${20}
  `('should return undefined if value is between min and max', ({ fieldname, value, min, max }) => {
    const sut = new BetweenValidator(fieldname, value, min, max)
    const result = sut.validate()
    expect(result).toEqual(undefined)
  })
})
