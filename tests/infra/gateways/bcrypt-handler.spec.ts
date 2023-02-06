import { BcryptHandler } from '@/infra/gateways'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

describe('Bcrypt adapter', () => {
  const salt = 12
  let sut: BcryptHandler

  beforeEach(() => {
    sut = new BcryptHandler(salt)
  })

  it('should call bcrypt.hash with correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })

  it('should call bcrypt.compare with correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_hashed', 'any_password')
    expect(hashSpy).toHaveBeenCalledWith('any_hashed', 'any_password')
    expect(hashSpy).toHaveBeenCalledTimes(1)
  })

  it('should return true if hashedPassword and password matches', async () => {
    const hash = await sut.encrypt('any_value')
    const compare = await sut.compare('hash', hash)
    expect(compare).toBe(true)
  })
})
