import { UpdateUserController } from '@/application/controllers/user'
import { UpdateUser } from '@/domain/contracts/repos'
import { BetweenValidator, EmailConfirmationValidator, PasswordConfirmationValidator, Required, RequiredString, UniqueValidator } from '@/application/validation'
import { User } from '@/infra/repos/postgres/entities'

describe('UpdateUserController', () => {
  let sut: UpdateUserController
  let updateUser: jest.Mock
  let data: UpdateUser.Input & { passwordConfirmation?: string }

  beforeAll(() => {
    data = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    updateUser = jest.fn()
    updateUser.mockResolvedValue({ user: 'any_user' })
  })

  beforeEach(() => {
    sut = new UpdateUserController(updateUser)
  })

  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators(data)
    expect(validators).toEqual([

      new RequiredString('any_id', 'id'),
      new RequiredString('any_password', 'password'),
      new BetweenValidator('password', 'any_password', 8, 20),
      new PasswordConfirmationValidator('any_password', 'any_password'),
      new Required({ value: data.email!, id: data.id }, 'email'),
      new EmailConfirmationValidator({ value: data.email!, id: data.id }),
      new UniqueValidator(User, { value: data.email!, id: data.id }, 'email')
    ])
  })

  describe('after validated', () => {
    beforeEach(() => {
      jest.spyOn(sut, 'buildValidators').mockImplementationOnce(async () => [])
    })

    it('should call updateUser with correct params', async () => {
      await sut.handle(data)
      const { passwordConfirmation, ...update } = data
      expect(updateUser).toHaveBeenCalledWith(update)
      expect(updateUser).toHaveBeenCalledTimes(1)
    })

    it('should return 400 if  updateUser throws', async () => {
      updateUser.mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(data)

      expect(httpResponse).toEqual({
        statusCode: 400,
        data: new Error()
      })
    })

    it('should return 200 if updateUser succeeds', async () => {
      const httpResponse = await sut.handle(data)

      expect(httpResponse).toEqual({
        statusCode: 200,
        data: {
          user: 'any_user'
        }
      })
    })
  })
})
