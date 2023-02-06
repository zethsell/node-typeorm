import { AllowedMimeTypes, BetweenValidator, EmailConfirmationValidator, ExistConfirmationValidator, MaxFileSize, MaxValidator, MinValidator, PasswordConfirmationValidator, Required, RequiredBuffer, RequiredString, UniqueValidator, ValidationBuilder } from '@/application/validation'
import { PgArea } from '@/infra/repos/postgres/entities'

describe('ValidationBuilder', () => {
  it('should return a RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_name')])
  })

  it('should return a RequiredString when value is number', () => {
    const validators = ValidationBuilder
      .of({ value: 10, fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('10', 'any_name')])
  })

  it('should return a RequiredString when value is undefined', () => {
    const validators = ValidationBuilder
      .of({ value: undefined, fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString(undefined as any, 'any_name')])
  })

  it('should return a RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: buffer })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })

  it('should return a Required', () => {
    const validators = ValidationBuilder
      .of({ value: { any: 'any_value' } })
      .required()
      .build()

    expect(validators).toEqual([new Required({ any: 'any_value' })])
  })

  it('should return a Required', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .required()
      .build()

    expect(validators).toEqual([
      new Required({ buffer }),
      new RequiredBuffer(buffer)
    ])
  })

  it('should return Required when field is not required, but need be validated if was filled', () => {
    const validators = ValidationBuilder
      .of({ value: { any: 'any_value' } })
      .sometimes()
      .build()

    expect(validators).toEqual([new Required({ any: 'any_value' })])
  })

  it('should return ExistConfirmationValidator', async () => {
    const validators = (await ValidationBuilder
      .of({ value: { id: 1 } })
      .sometimes()
      .exists(PgArea))
      .build()

    expect(validators).toEqual([new Required({ id: 1 }), new ExistConfirmationValidator(PgArea, { id: 1 })])
  })

  it('should return UniqueValidator', async () => {
    const validators = (await ValidationBuilder
      .of({ value: 1, fieldName: 'id' })
      .sometimes()
      .unique(PgArea))
      .build()

    expect(validators).toEqual([new Required('1', 'id'), new UniqueValidator(PgArea, 1, 'id')])
  })

  it('should return EmailConfirmationValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value' })
      .sometimes()
      .email()
      .build()

    expect(validators).toEqual([new RequiredString('any_value'), new EmailConfirmationValidator('any_value')])
  })

  it('should return MinValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_field' })
      .sometimes()
      .min(10)
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_field'), new MinValidator('any_field', 'any_value', 10)])
  })

  it('should return MaxValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_field' })
      .sometimes()
      .max(10)
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_field'), new MaxValidator('any_field', 'any_value', 10)])
  })

  it('should return BetweenValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_field' })
      .sometimes()
      .between(10, 20)
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_field'), new BetweenValidator('any_field', 'any_value', 10, 20)])
  })

  it('should return PasswordConfirmationValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'password' })
      .sometimes()
      .password('password')
      .build()

    expect(validators).toEqual([new RequiredString('password'), new PasswordConfirmationValidator('password', 'password')])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new MaxFileSize(6, buffer)])
  })

  it('should return correct image validators', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png'], 'image/png'),
      new MaxFileSize(6, buffer)
    ])
  })

  it('should return correct video validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .video({ allowed: ['mkv'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new MaxFileSize(6, buffer)])
  })

  it('should return correct video validators', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType: 'video/mkv' } })
      .video({ allowed: ['mkv'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['mkv'], 'video/mkv')])
  })

  it('should return correct video validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType: 'video/mkv' } })
      .video({ allowed: ['mkv'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['mkv'], 'video/mkv'),
      new MaxFileSize(6, buffer)
    ])
  })

  it('should return correct file validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .file({ allowed: ['pdf'], maxSizeInMb: 40 })
      .build()

    expect(validators).toEqual([new MaxFileSize(40, buffer)])
  })

  it('should return correct file validators', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType: 'application/pdf' } })
      .file({ allowed: ['pdf'], maxSizeInMb: 40 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['pdf'], 'application/pdf')])
  })

  it('should return correct file validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType: 'application/pdf' } })
      .file({ allowed: ['pdf'], maxSizeInMb: 40 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['pdf'], 'application/pdf'),
      new MaxFileSize(40, buffer)
    ])
  })
})
