import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { LogRepository } from '@/infra/repos/postgres/log'
import { Log, User } from '@/infra/repos/postgres/entities'
import { Log as ILog, InsertUser as IUser } from '@/domain/contracts/repos'

describe('LogRepository', () => {
  let sut: LogRepository
  let repo: Repository<Log>
  let userRepo: Repository<User>
  let backup: IBackup

  const makeFakeUser = (): IUser.Input => ({
    email: 'any_email',
    password: 'any_password',
    name: 'any_user'
  })

  const makeFakeLog = (): ILog => ({
    id: 1,
    message: 'any_description',
    origin: 'any_table',
    type: 'any_type',
    user: { id: 1 }
  })

  beforeAll(async () => {
    const db = await makeFakeDb()
    backup = db.backup()
    repo = getRepository(Log)
    userRepo = getRepository(User)
  })

  beforeEach(async () => {
    backup.restore()
    sut = new LogRepository()
    await userRepo.save(makeFakeUser() as any)
    await repo.save(makeFakeLog() as any)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  it('should return log', async () => {
    const log = await sut.get()
    expect(log).toHaveLength(1)
  })

  it('should return undefined if log table are empty', async () => {
    backup.restore()
    const log = await sut.get()
    expect(log).toEqual([])
  })

  it('should create an log ', async () => {
    await sut.insert(makeFakeLog() as any)
    const logs = await repo.count()
    expect(logs).toBe(1)
  })
})
