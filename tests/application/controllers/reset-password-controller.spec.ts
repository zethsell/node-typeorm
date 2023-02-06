import { ResetPasswordController } from '@/application/controllers'
import { RequiredString } from '@/application/validation'

describe('ResetPasswordController', () => {
  let sut: ResetPasswordController
  let resetPass: jest.Mock
  let data: any

  beforeAll(() => {
    data = { id: 'any_id' }
    resetPass = jest.fn()
    resetPass.mockResolvedValue({ user: 'any_user' })
  })

  beforeEach(() => {
    sut = new ResetPasswordController(resetPass)
  })

  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators({ id: 'any_id' })
    expect(validators).toEqual([
      new RequiredString('any_id', 'id')
    ])
  })

  it('should call resetPass with correct params', async () => {
    await sut.handle(data)

    expect(resetPass).toHaveBeenCalledWith(data)
    expect(resetPass).toHaveBeenCalledTimes(1)
  })

  it('should return 404 if no resetPass throws', async () => {
    resetPass.mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error()
    })
  })

  it('should return 200 if resetPass succeeds', async () => {
    const httpResponse = await sut.handle(data)

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        message: 'password reseted with success'
      }
    })
  })
})
