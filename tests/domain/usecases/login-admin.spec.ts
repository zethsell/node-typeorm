import { TokenGenerator } from '@/domain/contracts/gateways'
import { LoginUser as Login } from '@/domain/entities'
import { PermissionError } from '@/domain/entities/errors'
import { AuthenticateUserAdmin, setupLoginAdmin } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'

describe('Login Test', () => {
  let login: MockProxy<Login>
  let token: MockProxy<TokenGenerator>
  let sut: AuthenticateUserAdmin
  let data: { password: string, email: string}

  beforeAll(() => {
    login = jest.fn().mockResolvedValue({ id: 'any_id', admin: true })
    token = mock()
    token.generate.mockResolvedValue('any_token')
    data = { email: 'valid_email', password: 'valid_password' }
  })

  beforeEach(() => {
    sut = setupLoginAdmin(login, token)
  })

  it('ensure setupLogin called with valid input', async () => {
    await sut(data)
    expect(login).toHaveBeenCalledWith(data)
    expect(login).toHaveBeenCalledTimes(1)
  })

  it('ensure setupLogin return token', async () => {
    const token = await sut(data)
    expect(token).toEqual({ accessToken: 'any_token' })
  })

  it('should throw if user as not an admin', async () => {
    mocked(login).mockResolvedValueOnce({ id: 'any_id', admin: false })
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new PermissionError())
  })

  it('should rethrow if Login throws', async () => {
    mocked(login).mockRejectedValueOnce(new Error('login_error'))
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new Error('login_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    token.generate.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut(data)
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
