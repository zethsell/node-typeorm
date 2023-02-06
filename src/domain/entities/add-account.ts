import { AccountModel } from '@/domain/entities/account'

export interface AddAccountModel {
  name: string
  email: string
  password: string
  createdAt?: string
  updatedAt?: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
