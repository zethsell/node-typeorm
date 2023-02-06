import { LoggedUserController } from '@/application/controllers/user'
import { ContentNotFound } from '@/application/errors'
import { RequiredString } from '@/application/validation'
import { AuthenticationError } from '@/domain/entities/errors'

describe('LoggedUserController', () => {
  let sut: LoggedUserController
  let loggedUser: jest.Mock
  let data: { authUserId: string }

  beforeAll(() => {
    data = { authUserId: 'any_id' }
    loggedUser = jest.fn()
    loggedUser.mockResolvedValue({ user: 'any_user' })
  })

  beforeEach(() => {
    sut = new LoggedUserController(loggedUser)
  })

  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators(data)
    expect(validators).toEqual([
      new RequiredString('any_id', 'token')
    ])
  })

  it('should call loggedUser with correct params', async () => {
    await sut.handle(data)

    expect(loggedUser).toHaveBeenCalledWith({ id: 'any_id' })
    expect(loggedUser).toHaveBeenCalledTimes(1)
  })

  it('should return 404 if no user are not found', async () => {
    loggedUser.mockRejectedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: new ContentNotFound('user')
    })
  })

  it('should return 200 if loggedUser succeeds', async () => {
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        user: 'any_user'
      }
    })
  })
})
