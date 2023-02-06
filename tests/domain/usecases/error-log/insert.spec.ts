import { InsertErrorLog as Save } from '@/domain/contracts/repos'
import { InsertErrorLog, setupInsertErrorLog } from '@/domain/usecases/error-log'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List Users', () => {
  let logError: MockProxy<Save>
  let sut: InsertErrorLog
  let data: Save.Input

  beforeAll(() => {
    logError = mock()
    data = { message: 'any_message' }
  })

  beforeEach(() => {
    sut = setupInsertErrorLog(logError)
  })

  it('should call insertErrorlog with correct param to new logError', async () => {
    await sut(data)
    expect(logError.insert).toHaveBeenCalledWith({ message: 'any_message' })
    expect(logError.insert).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if save throws', async () => {
    logError.insert.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
