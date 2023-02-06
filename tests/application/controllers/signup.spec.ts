import { EmailConfirmationValidator } from '@/application/validation/email-validator'
import { SignUpController } from '@/application/controllers'
import { PasswordConfirmationValidator, RequiredString, UniqueValidator } from '@/application/validation'
import { AddAccount } from '@/domain/entities'

import { User } from '@/infra/repos/postgres/entities'
import { mock, MockProxy } from 'jest-mock-extended'

type data = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

describe('SignUp Controller', () => {
  let sut: SignUpController
  let data: data
  let addAccount: MockProxy<AddAccount>

  beforeAll(() => {
    data = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
    addAccount = mock()
    addAccount.add.mockResolvedValue({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  beforeEach(() => {
    sut = new SignUpController(addAccount)
  })

  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators(data)
    expect(validators).toEqual([
      new RequiredString('valid_name', 'name'),
      new RequiredString('valid_email@mail.com', 'email'),
      new EmailConfirmationValidator(data.email),
      new UniqueValidator(User, data.email, 'email'),
      new RequiredString('valid_password', 'password'),
      new PasswordConfirmationValidator(data.password, data.passwordConfirmation)
    ])
  })
  describe('after validated', () => {
    beforeEach(() => {
      jest.spyOn(sut, 'buildValidators').mockImplementationOnce(async () => [])
    })

    it('Should return 400 if AddAccount throws', async () => {
      addAccount.add.mockRejectedValueOnce(new Error('any_error'))
      const httpResponse = await sut.handle(data)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.data).toEqual(new Error('any_error'))
    })

    it('Should call AddAccount with correct values', async () => {
      const addSpy = addAccount.add
      await sut.handle(data)

      expect(addSpy).toHaveBeenCalledWith({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      })
    })

    it('Should return 200 if valid data is provided', async () => {
      const httpResponse = await sut.handle(data)
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.data).toEqual({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      })
    })
  })
})
