import { ContentNotFound } from '@/application/errors'
import { Encrypter } from '@/domain/contracts/gateways'
import { InsertUser as Save, User } from '@/domain/contracts/repos'

type Setup = (userRepo: Save, encrypter: Encrypter) => InsertUser
type Input = Save.Input
type Output = User

export type InsertUser = (input: Input) => Promise<Output>

export const setupInsertUser: Setup = (userRepo, encrypter) => async input => {
  const hashedPassword = await encrypter.encrypt(input.password as any)
  const user = await userRepo.insert(Object.assign({}, input, { password: hashedPassword }))
  if (user !== undefined) return user
  throw new ContentNotFound('user')
}
