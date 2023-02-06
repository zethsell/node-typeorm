import { ContentNotFound } from '@/application/errors'
import { Encrypter } from '@/domain/contracts/gateways'
import { UpdateUser as Save } from '@/domain/contracts/repos'
import { UpdateUser, setupUpdateUser } from '@/domain/usecases/user'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List Users', () => {
  let user: MockProxy<Save>
  let encrypter: MockProxy<Encrypter>
  let sut: UpdateUser
  let data: Save.Input

  beforeAll(() => {
    user = mock()
    encrypter = mock()
    user.update.mockResolvedValue({
      id: 1,
      name: 'bd_name',
      email: 'bd_email',
      createdAt: 'bd_createdAt',
      updatedAt: 'bd_updatedAt'
    })
    data = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    encrypter.encrypt.mockResolvedValue('hashed_password')
  })

  beforeEach(() => {
    sut = setupUpdateUser(user, encrypter)
  })

  it('should call ListUsers with correct param to Update User', async () => {
    await sut(data)

    expect(user.update).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password'
    })
    expect(user.update).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if save throws', async () => {
    user.update.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut(data)

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should throws if update returns undefined', async () => {
    user.update.mockResolvedValueOnce(undefined)
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new ContentNotFound('user'))
  })

  it('should return an user  if is provided', async () => {
    const response = await sut(data)

    expect(response).toEqual({
      id: 1,
      name: 'bd_name',
      email: 'bd_email',
      createdAt: 'bd_createdAt',
      updatedAt: 'bd_updatedAt'
    })
  })
})
