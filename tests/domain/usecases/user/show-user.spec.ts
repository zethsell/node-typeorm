import { ContentNotFound } from '@/application/errors'
import { ShowUser } from '@/domain/contracts/repos'
import { ListUser, setupShowUser } from '@/domain/usecases/user'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List Users', () => {
  let user: MockProxy<ShowUser>
  let sut: ListUser

  beforeAll(() => {
    user = mock()
    user.show.mockResolvedValue({
      id: 1,
      name: 'any_name',
      email: 'any_email',
      createdAt: '2022-03-29',
      updatedAt: '2022-03-29'
    })
  })

  beforeEach(() => {
    sut = setupShowUser(user)
  })

  it('should return a user', async () => {
    const response = await sut({ id: 'any_id' })

    expect(response).toEqual({
      id: 1,
      name: 'any_name',
      email: 'any_email',
      createdAt: '2022-03-29',
      updatedAt: '2022-03-29'
    })
  })

  it('should call ListUsers with correct param', async () => {
    await sut({ id: 'any_id' })

    expect(user.show).toHaveBeenCalledWith({ id: 'any_id' })
    expect(user.show).toHaveBeenCalledTimes(1)
  })

  it('should throws if show returns undefined', async () => {
    user.show.mockResolvedValueOnce(undefined)
    const promise = sut({ id: 'any_id' })
    await expect(promise).rejects.toThrow(new ContentNotFound('user'))
  })

  it('should rethrow if show throws', async () => {
    user.show.mockRejectedValueOnce(new Error('show_error'))
    const promise = sut({ id: 'any_id' })

    await expect(promise).rejects.toThrow(new Error('show_error'))
  })
})
