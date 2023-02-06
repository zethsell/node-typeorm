import { ShowUser } from '@/domain/contracts/repos'
import { LoggedUser, setupLoggedUser } from '@/domain/usecases/user/logged-user'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List Users', () => {
  let user: MockProxy<ShowUser>
  let sut: LoggedUser
  let id: string

  beforeAll(() => {
    id = 'any_id'
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
    sut = setupLoggedUser(user)
  })

  it('should return a user', async () => {
    const response = await sut({ id })

    expect(response).toEqual({
      id: 1,
      name: 'any_name',
      email: 'any_email',
      createdAt: '2022-03-29',
      updatedAt: '2022-03-29'
    })
  })

  it('should call UserShow with correct param', async () => {
    await sut({ id })

    expect(user.show).toHaveBeenCalledWith({ id: 'any_id' })
    expect(user.show).toHaveBeenCalledTimes(1)
  })

  it('should return undefined if user is not found', async () => {
    user.show.mockResolvedValueOnce(undefined)
    const response = await sut({ id })
    expect(response).toBeUndefined()
  })

  it('should rethrow if show throws', async () => {
    user.show.mockRejectedValueOnce(new Error('show_error'))
    const promise = sut({ id })
    await expect(promise).rejects.toThrow(new Error('show_error'))
  })

  /* it('should throws if  show user returns undefined', async () => {
    user.show.mockResolvedValueOnce(undefined)
    const promise = await sut({ id: 'any_id' })
    expect(promise).toEqual(new ContentNotFound('user'))
  }) */
})
