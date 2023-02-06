import { Login, ShowUserByEmail, UpdateUser } from '@/domain/contracts/repos'
import { BcryptHandler as Encrypter } from '@/infra/gateways'
import { AuthenticationError } from '@/domain/entities/errors'

type Setup = (userRepo: ShowUserByEmail & UpdateUser, encrypter: Encrypter) => LoginUser
type Input = Login.Input
type Output = {id: string, admin: boolean}

export type LoginUser = (input: Input) => Promise<Output>

export const setupExecuteLogin: Setup = (userRepo, encrypter) => async ({ email, password }) => {
  const user = await userRepo.showByEmail({ email })
  if (user?.password !== undefined) {
    const compare = await encrypter.compare(password, user.password)
    if (compare) {
      const { id, admin } = user
      user.firstAccess ||= new Date()
      user.lastAccess = new Date()
      await userRepo.update({ id: id.toString(), firstAccess: user.firstAccess, lastAccess: user.lastAccess })
      return { id: id.toString(), admin: admin! }
    }
  }
  throw new AuthenticationError()
}
