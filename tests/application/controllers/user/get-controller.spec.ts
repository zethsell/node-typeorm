import { GetUserController } from '@/application/controllers/user'

describe('GetUserController', () => {
  let sut: GetUserController
  let getUser: jest.Mock

  beforeAll(() => {
    getUser = jest.fn()
    getUser.mockResolvedValue({ data: 'any_value' })
  })

  beforeEach(() => {
    sut = new GetUserController(getUser)
  })

  it('should call ListUsers with correct params', async () => {
    await sut.perform()

    expect(getUser).toHaveBeenCalledWith()
    expect(getUser).toHaveBeenCalledTimes(1)
  })

  it('should return 200 if ListUsers succeeds', async () => {
    const httpResponse = await sut.perform()

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        data: 'any_value'
      }
    })
  })

  it('should return 400 if getBannerHome throws', async () => {
    getUser.mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error()
    })
  })
})
