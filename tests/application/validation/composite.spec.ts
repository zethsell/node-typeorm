import { ValidationComposite, Validator } from '@/application/validation'
import { mock, MockProxy } from 'jest-mock-extended'

describe('CalidationComposite', () => {
  let sut: ValidationComposite
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]

  beforeAll(() => {
    validator1 = mock<Validator>()
    validator1.validate.mockResolvedValue(undefined)
    validator2 = mock<Validator>()
    validator2.validate.mockResolvedValue(undefined)
    validators = [validator1, validator2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })
  it('should return undefined if all Validator returns undefined', async () => {
    const error = await sut.validate()
    expect(error).toBeUndefined()
  })

  it('should return the first error', async () => {
    validator1.validate.mockResolvedValueOnce(new Error('error_1'))
    validator2.validate.mockResolvedValueOnce(new Error('error_2'))
    const error = await sut.validate()
    expect(error).toEqual(new Error('error_1'))
  })

  it('should return the error', async () => {
    validator2.validate.mockResolvedValueOnce(new Error('error_2'))
    const error = await sut.validate()
    expect(error).toEqual(new Error('error_2'))
  })
})
