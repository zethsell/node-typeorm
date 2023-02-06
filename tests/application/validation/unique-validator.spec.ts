import { UniqueError, InvalidRepositoryError, InvalidRepositoryIdError } from '@/application/errors'
import { UniqueValidator } from '@/application/validation'
import { User } from '@/infra/repos/postgres/entities'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'

describe('UniqueValidator', () => {
  let repo: Repository<User>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb()
    backup = db.backup()
    repo = getRepository(User)
  })

  beforeEach(async () => {
    backup.restore()
    await repo.save({ id: 1, name: 'any_name', email: 'any_email' })
  })

  afterAll(async () => {
    await getConnection().close()
  })

  it('should return InvalidRepositoryError if Repository is empty', async () => {
    const sut = new UniqueValidator('', 1, 'any_fieldName')
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryError())
  })

  it('should return InvalidRepositoryError if value is null', async () => {
    const sut = new UniqueValidator(null as any, 1, 'any_fieldName')
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryError())
  })

  it('should return InvalidRepositoryError if value is undefined', async () => {
    const sut = new UniqueValidator(undefined as any, 1, 'any_fieldName')
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryError())
  })

  it('should return InvalidRepositoryIdError if value is null', async () => {
    const sut = new UniqueValidator(User, null as any, 'any_fieldName')
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryIdError())
  })

  it('should return InvalidRepositoryIdError if value is undefined', async () => {
    const sut = new UniqueValidator(User as any, undefined as any, 'any_fieldName')
    const error = await sut.validate()
    expect(error).toEqual(new InvalidRepositoryIdError())
  })

  it('should return undefined if value is valid', async () => {
    const sut = new UniqueValidator(User as any, 2, 'email')
    const error = await sut.validate()
    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid', async () => {
    const sut = new UniqueValidator(User as any, { value: 2, id: '1' }, 'email')
    const error = await sut.validate()
    expect(error).toBeUndefined()
  })

  it('should return UniqueError if a unique record already exists', async () => {
    const sut = new UniqueValidator(User as any, 'any_email', 'email')
    const error = await sut.validate()
    expect(error).toEqual(new UniqueError('email', 'any_email'))
  })
})
