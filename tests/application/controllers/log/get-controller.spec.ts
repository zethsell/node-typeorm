import { GetLogController } from '@/application/controllers/log'

describe('GetLogController', () => {
  let sut: GetLogController
  let getLog: jest.Mock

  beforeAll(() => {
    getLog = jest.fn()
    getLog.mockResolvedValue({ data: 'any_value' })
  })

  beforeEach(() => {
    sut = new GetLogController(getLog)
  })

  it('should call ListLog with correct params', async () => {
    await sut.perform()

    expect(getLog).toHaveBeenCalledWith()
    expect(getLog).toHaveBeenCalledTimes(1)
  })

  it('should return 200 if ListLog succeeds', async () => {
    const httpResponse = await sut.perform()

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        data: 'any_value'
      }
    })
  })

  it('should return 400 if getLog throws', async () => {
    getLog.mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error()
    })
  })
})
