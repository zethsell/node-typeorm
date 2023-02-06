import { AuthenticationError } from '@/domain/entities/errors/login-error'
import { BcryptHandler as Encrypter } from '@/infra/gateways'
import { Login, ShowUserByEmail, UpdateUser } from '@/domain/contracts/repos'
import { LoginUser, setupExecuteLogin } from '@/domain/entities'
import { mock, MockProxy } from 'jest-mock-extended'
import { set, reset } from 'mockdate'

describe('Login User', () => {
  let sut: LoginUser
  let userRepo: MockProxy<ShowUserByEmail & UpdateUser>
  let crypto: MockProxy<Encrypter>
  let data: Login.Input & {firstAccess?: Date | string}

  beforeAll(() => {
    set(new Date(2021, 9, 3, 10, 10, 10))
    data = { email: 'any_email', password: 'any_pass' }
    userRepo = mock()
    userRepo.showByEmail.mockResolvedValue({ id: 1, email: 'any_email', password: 'any_password' })
    crypto = mock()
    crypto.compare.mockResolvedValue(true)
  })

  beforeEach(() => { sut = setupExecuteLogin(userRepo, crypto) })

  afterAll(() => reset())

  it('should call userRepo.showByEmail with correct params', async () => {
    await sut(data)
    expect(userRepo.showByEmail).toHaveBeenCalledWith({ email: data.email })
    expect(userRepo.showByEmail).toHaveBeenCalledTimes(1)
  })

  it('should call crypto.compare with correct params', async () => {
    await sut(data)
    expect(crypto.compare).toHaveBeenCalledWith(data.password, 'any_password')
    expect(crypto.compare).toHaveBeenCalledTimes(1)
  })

  it('should call userRepo.update with correct params when firstAccess is undefined', async () => {
    await sut(data)
    expect(userRepo.update).toHaveBeenCalledWith({ id: '1', firstAccess: new Date(), lastAccess: new Date() })
    expect(userRepo.update).toHaveBeenCalledTimes(1)
  })

  it('should call userRepo.update with correct params when firstAccess is provided', async () => {
    userRepo.showByEmail.mockResolvedValueOnce({
      id: 1,
      email: 'any_email',
      password: 'any_password',
      firstAccess: new Date(2020, 9, 3, 10, 10, 10),
      lastAccess: new Date(2020, 9, 3, 10, 10, 10)
    })
    await sut(data)
    expect(userRepo.update).toHaveBeenCalledWith({ id: '1', firstAccess: new Date(2020, 9, 3, 10, 10, 10), lastAccess: new Date(2021, 9, 3, 10, 10, 10) })
    expect(userRepo.update).toHaveBeenCalledTimes(1)
  })

  it('should throw AuthenticationError if  userRepo.showByEmail return undefined', async () => {
    userRepo.showByEmail.mockResolvedValueOnce(undefined)
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  it('should throw AuthenticationError if crypto.compare returns false', async () => {
    crypto.compare.mockResolvedValueOnce(false)
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new AuthenticationError())
  })
})
