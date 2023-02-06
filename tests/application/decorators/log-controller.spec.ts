import { Controller } from '@/application/controllers'
import { LogController } from '@/application/decorators'
import { InsertLog } from '@/domain/usecases/log'
import { InsertErrorLog } from '@/domain/usecases/error-log'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'

describe('LogController', () => {
  let decoratee: MockProxy<Controller>
  let sut: LogController
  let log: MockProxy<InsertLog>
  let logError: MockProxy<InsertErrorLog>

  beforeAll(() => {
    log = jest.fn().mockImplementation()
    logError = jest.fn().mockImplementation()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 200, data: { id: 1 } })
  })

  beforeEach(() => {
    sut = new LogController(decoratee, log, logError)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })

  it('should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })
    expect(httpResponse).toEqual({ statusCode: 200, data: { id: 1 } })
  })

  it('should rethrow if decoratee throws', async () => {
    const error = new Error('decoratee_error')
    decoratee.perform.mockRejectedValueOnce(error)
    const promise = sut.perform({ any: 'any' })
    await expect(promise).rejects.toThrow(error)
  })

  it('should extends controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })
    expect(httpResponse).toEqual({ statusCode: 200, data: { id: 1 } })
  })

  it('should rethrow if decoratee throws', async () => {
    const error = new Error('any_error')
    decoratee.perform.mockRejectedValueOnce(error)
    const promise = sut.perform({ any: 'any' })
    await expect(promise).rejects.toThrow(error)
  })

  it('should call log error if decoratee throws', async () => {
    const error = new Error('any_error')
    decoratee.perform.mockRejectedValueOnce(new Error('any_error'))
    sut.perform({ any: 'any' }).catch(() => {
      expect(logError).toHaveBeenCalledWith({ message: error })
      expect(logError).toHaveBeenCalledTimes(1)
    })
  })

  it('should rethrow if log throws', async () => {
    const error = 'any_error'
    mocked(log).mockRejectedValueOnce(new Error(error))
    const promise = sut.perform({ any: 'any', authUserId: 1 })
    await expect(promise).rejects.toThrow(new Error(error))
  })

  it('should call log error if log throws', async () => {
    const error = 'any_error'
    mocked(log).mockRejectedValueOnce(new Error(error))
    sut.perform({ any: 'any', authUserId: 1 }).catch(() => {
      expect(logError).toHaveBeenCalledWith({ message: new Error(error) })
      expect(logError).toHaveBeenCalledTimes(1)
    })
  })

  it('should call log if statusCode is 200', async () => {
    await sut.perform({ any: 'any', authUserId: 1 })
    expect(log).toHaveBeenCalled()
    expect(log).toHaveBeenCalledTimes(1)
  })
})
