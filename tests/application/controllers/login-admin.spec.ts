import { LoginAdminController } from '@/application/controllers'
import { ForbiddenError, UnauthorizedError } from '@/application/errors'
import { EmailConfirmationValidator, RequiredString } from '@/application/validation'
import { Login } from '@/domain/contracts/repos'
import { AuthenticationError, PermissionError } from '@/domain/entities/errors'

describe('LoginAdminController', () => {
  let sut: LoginAdminController
  let userAuth: jest.Mock
  let data: Login.Input

  beforeAll(() => {
    data = { email: 'any_email@mail.com', password: 'any_password' }
    userAuth = jest.fn()
    userAuth.mockResolvedValue({ accessToken: 'any_value' })
  })

  beforeEach(() => {
    sut = new LoginAdminController(userAuth)
  })

  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators(data)
    expect(validators).toEqual([
      new RequiredString('any_email@mail.com', 'email'),
      new EmailConfirmationValidator('any_email@mail.com'),
      new RequiredString('any_password', 'password')
    ])
  })

  it('should call userAuthentication with correct params', async () => {
    await sut.handle(data)
    expect(userAuth).toHaveBeenCalledWith(data)
    expect(userAuth).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    userAuth.mockRejectedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 403 if User is not an Admin', async () => {
    userAuth.mockRejectedValueOnce(new PermissionError())
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
