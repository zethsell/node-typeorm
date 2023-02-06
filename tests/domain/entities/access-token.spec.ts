import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  it('should expire in 14400000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(14400000)
  })
})
