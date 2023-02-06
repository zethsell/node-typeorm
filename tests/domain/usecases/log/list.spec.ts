import { ListLog as List } from '@/domain/contracts/repos'
import { ListLog, setupListLog } from '@/domain/usecases/log'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List log', () => {
  let log: MockProxy<List>
  let sut: ListLog

  beforeAll(() => {
    log = mock()
    log.get.mockResolvedValue([])
  })

  beforeEach(() => {
    sut = setupListLog(log)
  })

  it('should call ListLog with correct param', async () => {
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
