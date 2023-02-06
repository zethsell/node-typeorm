import { ContentNotFound, InvalidRepositoryError, InvalidRepositoryIdError } from '@/application/errors'
import { ExistConfirmationValidator } from '@/application/validation'
import { User } from '@/infra/repos/postgres/entities'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'

describe('ExistConfirmationValidator', () => {
  let UserRepo: Repository<User>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb()
    backup = db.backup()
    UserRepo = getRepository(User)
  })

  beforeEach(async () => {
    backup.restore()
    await UserRepo.save({ id: 1, name: 'any_name', email: 'any_email' })
  })

  afterAll(async () => {
    await getConnection().close()
  })

  it('should return InvalidRepositoryError if Repository is empty', async () => {
    const sut = new ExistConfirmationValidator('', { id: '1' })
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryError())
  })

  it('should return InvalidRepositoryError if value is null', async () => {
    const sut = new ExistConfirmationValidator(null as any, { id: '1' })
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryError())
  })

  it('should return InvalidRepositoryError if value is undefined', async () => {
    const sut = new ExistConfirmationValidator(undefined as any, { id: '1' })
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryError())
  })

  it('should return InvalidRepositoryIdError if value is null', async () => {
    const sut = new ExistConfirmationValidator(User, null as any)
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryIdError())
  })

  it('should return InvalidRepositoryIdError if value is undefined', async () => {
    const sut = new ExistConfirmationValidator(User as any, undefined as any)
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryIdError())
  })

  it('should return undefined if value is valid', async () => {
    const sut = new ExistConfirmationValidator(User as any, { id: '1' })
    const error = await sut.validate()
    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid', async () => {
    const sut = new ExistConfirmationValidator(User as any, '1')
    const error = await sut.validate()
    expect(error).toBeUndefined()
  })

  it('should return ContentNotFound if no repository is found', async () => {
    const sut = new ExistConfirmationValidator(User as any, { id: '2' })
    const error = await sut.validate()
    expect(error).toEqual(new ContentNotFound())
  })
})
