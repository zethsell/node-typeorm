import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { ErrorLogRepository } from '@/infra/repos/postgres'
import { ErrorLog } from '@/infra/repos/postgres/entities'
import { ErrorLog as ILog } from '@/domain/contracts/repos'

describe('ErrorLogRepository', () => {
  let sut: ErrorLogRepository
  let repo: Repository<ErrorLog>
  let backup: IBackup

  const makeFakeLog = (): ILog => ({
    id: 1,
    message: 'any_description'
  })

  beforeAll(async () => {
    const db = await makeFakeDb([ErrorLog])
    backup = db.backup()
    repo = getRepository(ErrorLog)
  })

  beforeEach(async () => {
    backup.restore()
    sut = new ErrorLogRepository()
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
    expect(logs).toBe(2)
  })
})
