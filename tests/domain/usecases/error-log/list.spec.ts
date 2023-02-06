import { ListErrorLog as List } from '@/domain/contracts/repos'
import { ListErrorLog, setupListErrorLog } from '@/domain/usecases/error-log'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List log', () => {
  let log: MockProxy<List>
  let sut: ListErrorLog

  beforeAll(() => {
    log = mock()
    log.get.mockResolvedValue([])
  })

  beforeEach(() => {
    sut = setupListErrorLog(log)
  })

  it('should call ListLogsError with correct param', async () => {
    await sut()
    expect(log.get).toHaveBeenCalledWith()
    expect(log.get).toHaveBeenCalledTimes(1)
  })

  it('should return a list of log', async () => {
    const response = await sut()
    expect(response).toEqual([])
  })

  it('should return empty if log is not found', async () => {
    log.get.mockResolvedValueOnce([])
    const response = await sut()
    expect(response).toEqual([])
  })

  it('should rethrow if load throws', async () => {
    log.get.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut()
    await expect(promise).rejects.toThrow(new Error('load_error'))
  })
})
