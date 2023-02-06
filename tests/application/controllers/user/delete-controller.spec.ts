import { DeleteUserController } from '@/application/controllers/user'
import { RequiredString } from '@/application/validation'
import { ShowUser } from '@/domain/contracts/repos'

describe('DeleteUserController', () => {
  let sut: DeleteUserController
  let deleteUser: jest.Mock
  let data: ShowUser.Input

  beforeAll(() => {
    data = { id: 'any_id' }
    deleteUser = jest.fn()
  })

  beforeEach(() => {
    sut = new DeleteUserController(deleteUser)
  })

  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators(data)
    expect(validators).toEqual([
      new RequiredString('any_id', 'id')
    ])
  })

  it('should call deleteUser with correct params', async () => {
    await sut.handle(data)

    expect(deleteUser).toHaveBeenCalledWith(data)
    expect(deleteUser).toHaveBeenCalledTimes(1)
  })

  it('should return 400 if deleteuser throws', async () => {
    deleteUser.mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error()
    })
  })

  it('should return 200 if deleteUser succeeds', async () => {
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: ''
    })
  })
})
