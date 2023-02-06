import { DeleteUser as Delete } from '@/domain/contracts/repos'

type Setup = (userRepo: Delete) => DeleteUser
type Input = { id: string }

export type DeleteUser = (input: Input) => Promise<void>

export const setupDeleteUser: Setup = (userRepo) => async input => {
  await userRepo.delete(input)
}
