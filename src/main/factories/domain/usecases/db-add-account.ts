import { DbAddAccount } from '@/domain/usecases'
import { makeAccountRepo } from '@/main/factories/infra/repos/account'
import { makeBcryptHandler } from '@/main/factories/infra/gateways'

export const makeDbAddAccount = (): DbAddAccount => {
  return new DbAddAccount(
    makeBcryptHandler(),
    makeAccountRepo()
  )
}
