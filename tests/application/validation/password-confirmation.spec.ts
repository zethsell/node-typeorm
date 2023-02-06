import { PasswordConfirmationError } from '@/application/errors'
import { PasswordConfirmationValidator } from '@/application/validation'

describe('Password Confirmation', () => {
  it('should return PasswordConfirmationError if value is empty', () => {
    const sut = new PasswordConfirmationValidator('any_value', '')

    const error = sut.validate()

    expect(error).toEqual(new PasswordConfirmationError())
  })

  it('should return PasswordConfirmationError if value is null', () => {
    const sut = new PasswordConfirmationValidator(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new PasswordConfirmationError())
  })

  it('should return PasswordConfirmationError if value is undefined', () => {
    const sut = new PasswordConfirmationValidator(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new PasswordConfirmationError())
  })

  it('should return undefined if value is valid', () => {
    const sut = new PasswordConfirmationValidator('any_value', 'any_value')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
