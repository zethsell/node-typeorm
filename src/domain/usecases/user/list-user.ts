import { LoadUsers } from '@/domain/contracts/repos/user'

type Setup = (userRepo: LoadUsers) => ListUsers
type Output = LoadUsers.Output

export type ListUsers = () => Promise<Output>

export const setupListUsers: Setup = (userRepo) => async () => {
  return await userRepo.get()
}
