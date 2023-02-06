import { DeleteUser as Delete } from '@/domain/contracts/repos'
import { DeleteUser, setupDeleteUser } from '@/domain/usecases/user'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List Users', () => {
  let user: MockProxy<Delete>
  let sut: DeleteUser

  beforeAll(() => {
    user = mock()
  })

  beforeEach(() => {
    sut = setupDeleteUser(user)
  })

  it('should call DeleteUser with correct param', async () => {
    await sut({ id: 'any_id' })

    expect(user.delete).toHaveBeenCalledWith({ id: 'any_id' })
    expect(user.delete).toHaveBeenCalledTimes(1)
  })

  it('should return', async () => {
    const response = await sut({ id: 'any_id' })

    expect(response).toBeUndefined()
  })

  it('should rethrow if delete throws', async () => {
    user.delete.mockRejectedValueOnce(new Error('delete_error'))
    const promise = sut({ id: 'any_id' })

    await expect(promise).rejects.toThrow(new Error('delete_error'))
  })
})
