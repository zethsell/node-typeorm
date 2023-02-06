import { ResetPassword, setupResetPassword } from '@/domain/usecases'
import { Encrypter, ResetPassword as ResetPass } from '@/domain/contracts/gateways'
import { mock, MockProxy } from 'jest-mock-extended'
import { env } from '@/main/config/env'

describe('PasswordReset', () => {
  let sut: ResetPassword
  let encrypter: MockProxy<Encrypter>
  let reset: MockProxy<ResetPass>
  let data: any

  beforeAll(() => {
    data = { id: 'any_id' }
    reset = mock()
    encrypter = mock()
    reset.resetPassword.mockResolvedValue()
    encrypter.encrypt.mockResolvedValue('hashed_password')
  })

  beforeEach(() => {
    sut = setupResetPassword(reset, encrypter)
  })

  it('should call resetPassword with correct params', async () => {
    await sut(data)
    expect(reset.resetPassword).toHaveBeenCalledWith({ id: 'any_id', hashedPassword: 'hashed_password' })
    expect(reset.resetPassword).toHaveBeenCalledTimes(1)
  })

  it('should call encrypt with correct params', async () => {
    await sut(data)

    expect(encrypter.encrypt).toHaveBeenCalledWith(env.defaultPass)
    expect(encrypter.encrypt).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if save throws', async () => {
    reset.resetPassword.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut(data)

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
