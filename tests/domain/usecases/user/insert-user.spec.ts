import { ContentNotFound } from '@/application/errors'
import { Encrypter } from '@/domain/contracts/gateways'
import { InsertUser as Save } from '@/domain/contracts/repos'
import { InsertUser, setupInsertUser } from '@/domain/usecases/user'
import { mock, MockProxy } from 'jest-mock-extended'

describe('List Users', () => {
  let user: MockProxy<Save>
  let encrypter: MockProxy<Encrypter>
  let sut: InsertUser
  let data: Save.Input

  beforeAll(() => {
    user = mock()
    encrypter = mock()
    user.insert.mockResolvedValue({
      id: 1,
      name: 'bd_name',
      email: 'bd_email',
      createdAt: 'bd_createdAt',
      updatedAt: 'bd_updatedAt'
    })
    data = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      level: { id: 1 },
      status: { id: 1 }
    }
    encrypter.encrypt.mockResolvedValue('hashed_password')
  })

  beforeEach(() => {
    sut = setupInsertUser(user, encrypter)
  })

  it('should call insertUser with correct param to new User', async () => {
    await sut(data)
    expect(user.insert).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password',
      level: { id: 1 },
      status: { id: 1 }
    })
    expect(user.insert).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if save throws', async () => {
    user.insert.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut(data)

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should return an user  ', async () => {
    const response = await sut(data)

    expect(response).toMatchObject({
      id: 1,
      name: 'bd_name',
      email: 'bd_email',
      createdAt: 'bd_createdAt',
      updatedAt: 'bd_updatedAt'
    })
  })

  it('should throws if insert returns undefined', async () => {
    user.insert.mockResolvedValueOnce(undefined)
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new ContentNotFound('user'))
  })
})
