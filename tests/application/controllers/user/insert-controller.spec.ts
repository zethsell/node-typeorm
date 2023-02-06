import { InsertUserController } from '@/application/controllers/user'
import { BetweenValidator, EmailConfirmationValidator, PasswordConfirmationValidator, RequiredString, UniqueValidator } from '@/application/validation'
import { InsertUser } from '@/domain/contracts/repos'
import { User } from '@/infra/repos/postgres/entities'

describe('InsertUserController', () => {
  let sut: InsertUserController
  let insertUser: jest.Mock
  let data: InsertUser.Input & { passwordConfirmation: string }

  beforeAll(() => {
    data = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    insertUser = jest.fn()
    insertUser.mockResolvedValue({ user: 'any_user' })
  })

  beforeEach(() => {
    sut = new InsertUserController(insertUser)
  })

  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators(data)
    expect(validators).toEqual([
      new RequiredString('any_password', 'password'),
      new BetweenValidator('password', 'any_password', 8, 20),
      new PasswordConfirmationValidator('any_password', 'any_password'),
      new RequiredString('any_name', 'name'),
      new RequiredString('any_email@email.com', 'email'),
      new EmailConfirmationValidator('any_email@email.com'),
      new UniqueValidator(User, 'any_email@email.com', 'email')
    ])
  })

  describe('after validated', () => {
    beforeEach(() => {
      jest.spyOn(sut, 'buildValidators').mockImplementationOnce(async () => [])
    })

    it('should call insertUser with correct params', async () => {
      await sut.handle(data)
      expect(insertUser).toHaveBeenCalledWith(data)
      expect(insertUser).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if insertUser throws', async () => {
      insertUser.mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(data)

      expect(httpResponse).toEqual({
        statusCode: 400,
        data: new Error()
      })
    })

    it('should return 201 if insertUser succeeds', async () => {
      insertUser.mockResolvedValueOnce({ user: 'any_user' })
      const httpResponse = await sut.handle(data)

      expect(httpResponse).toEqual({
        statusCode: 201,
        data: { user: 'any_user' }

      })
    })
  })
})
