import { EmailInvalidError } from '@/application/errors'
import { EmailConfirmationValidator } from '@/application/validation'

describe('EmailConfirmationValidator', () => {
  it('should return EmailInvalidError if value is empty', () => {
    const sut = new EmailConfirmationValidator('')
    const error = sut.validate()
    expect(error).toEqual(new EmailInvalidError())
  })

  it('should return EmailInvalidError if value.value is empty', () => {
    const sut = new EmailConfirmationValidator({ value: '', id: 'any_id' })
    const error = sut.validate()
    expect(error).toEqual(new EmailInvalidError())
  })

  it('should return EmailInvalidError if value is null', () => {
    const sut = new EmailConfirmationValidator(null as any)
    const error = sut.validate()
    expect(error).toEqual(new EmailInvalidError())
  })

  it('should return EmailInvalidError if value is undefined', () => {
    const sut = new EmailConfirmationValidator(undefined as any)
    const error = sut.validate()
    expect(error).toEqual(new EmailInvalidError())
  })

  it('should return undefined if value is valid', () => {
    const sut = new EmailConfirmationValidator('valid@mail.com')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid', () => {
    const sut = new EmailConfirmationValidator({ value: 'valid@mail.com', id: 'any_id' })
    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})
