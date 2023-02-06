import { ContentNotFound } from '@/application/errors'
import { Encrypter } from '@/domain/contracts/gateways'
import { UpdateUser as Save, User } from '@/domain/contracts/repos'

type Setup = (userRepo: Save, encrypter: Encrypter) => UpdateUser
type Input = Save.Input
type Output = User

export type UpdateUser = (input: Input) => Promise<Output>

export const setupUpdateUser: Setup = (userRepo, encrypter) => async input => {
  let hashedPassword = null as any
  if (input.password != null) {
    hashedPassword = await encrypter.encrypt(input.password as any)
  }
  const user = await userRepo.update(Object.assign({}, input, { password: hashedPassword }))
  if (user !== undefined) return user
  throw new ContentNotFound('user')
}
