import { User } from '@/infra/repos/postgres/entities/user'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { AccountModel, AddAccountModel } from '@/domain/entities'
import { AddAccountRepository } from '@/domain/contracts/gateways'

export class UserAccountRepository extends PgRepository implements AddAccountRepository {
  async add ({ name, email, password }: AddAccountModel): Promise<AccountModel> {
    const { id } = await this.getRepository(User).save({ email, name, password })
    return {
      id: id.toString(), name, email, password
    }
  }
}
