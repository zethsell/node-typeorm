import { InsertLog as Save } from '@/domain/contracts/repos'
import { InsertLog, setupInsertLog } from '@/domain/usecases/log'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Insert log', () => {
  let logRepo: MockProxy<Save>
  let sut: InsertLog
  let data: Save.Input

  beforeAll(() => {
    logRepo = mock()
    logRepo.insert.mockResolvedValue('any_log' as any)
    data = {
      message: 'any_message',
      origin: 'any_origin',
      type: 'any_type',
      user: { id: 1, admin: false }
    }
  })

  beforeEach(() => {
    sut = setupInsertLog(logRepo)
  })

  it('should call typeRepo.show with correct params', async () => {
    await sut(data)
    expect(logRepo.insert).toHaveBeenCalledWith(data)
    expect(logRepo.insert).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if save throws', async () => {
    logRepo.insert.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
