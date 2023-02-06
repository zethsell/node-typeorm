import { LoadUsers } from '@/domain/contracts/repos'
import { ListUsers, setupListUsers } from '@/domain/usecases/user'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List Users', () => {
  let users: MockProxy<LoadUsers>
  let sut: ListUsers

  beforeAll(() => {
    users = mock()
    users.get.mockResolvedValue([])
  })

  beforeEach(() => {
    sut = setupListUsers(users)
  })

  it('should call ListUsers with correct param', async () => {
    await sut()

    expect(users.get).toHaveBeenCalledWith()
    expect(users.get).toHaveBeenCalledTimes(1)
  })

  it('should return a list of users', async () => {
    const response = await sut()

    expect(response).toEqual([])
  })

  it('should return empty if users is not found', async () => {
    users.get.mockResolvedValueOnce([])
    const response = await sut()

    expect(response).toEqual([])
  })

  it('should rethrow if load throws', async () => {
    users.get.mockRejectedValueOnce(new Error('laod_error'))
    const promise = sut()

    await expect(promise).rejects.toThrow(new Error('laod_error'))
  })
})
