import { User, Log } from '@/infra/repos/postgres/entities'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { ResetPasswordRepository } from '@/infra/repos/postgres/reset-password'

describe('UserRepository', () => {
  let sut: ResetPasswordRepository
  let repo: Repository<User>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([User, Log])
    backup = db.backup()
    repo = getRepository(User)
  })

  beforeEach(() => {
    backup.restore()
    sut = new ResetPasswordRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  it('should reset password an user if id is defined', async () => {
    await repo.save({
      email: 'any_email',
      password: 'any_password',
      name: 'maria'
    })

    await sut.resetPassword({ id: '1', hashedPassword: 'hashed_password' })
    const user = await repo.findOne(1)
    expect(user?.password).toBe('hashed_password')
  })
})
