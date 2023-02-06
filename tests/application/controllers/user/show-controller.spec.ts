import { ShowUserController } from '@/application/controllers/user'
import { ContentNotFound } from '@/application/errors'
import { RequiredString } from '@/application/validation'
import { ShowUser } from '@/domain/contracts/repos'
import { AuthenticationError } from '@/domain/entities/errors'

describe('ShowUserController', () => {
  let sut: ShowUserController
  let listUser: jest.Mock
  let data: ShowUser.Input

  beforeAll(() => {
    data = { id: 'any_id' }
    listUser = jest.fn()
    listUser.mockResolvedValue({ user: 'any_user' })
  })

  beforeEach(() => {
    sut = new ShowUserController(listUser)
  })

  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators(data)
    expect(validators).toEqual([
      new RequiredString('any_id', 'id')
    ])
  })

  it('should call ListUser with correct params', async () => {
    await sut.handle(data)

    expect(listUser).toHaveBeenCalledWith(data)
    expect(listUser).toHaveBeenCalledTimes(1)
  })

  it('should return 404 if no user are not found', async () => {
    listUser.mockRejectedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: new ContentNotFound('user')
    })
  })

  it('should return 200 if listUser succeeds', async () => {
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        user: 'any_user'
      }
    })
  })
})
