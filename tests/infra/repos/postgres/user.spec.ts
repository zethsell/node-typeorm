import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { UserRepository } from '@/infra/repos/postgres/user'
import { Log, User as Repo } from '@/infra/repos/postgres/entities'
import { User } from '@/domain/contracts/repos'

describe('UserRepository', () => {
  let sut: UserRepository
  let UserRepo: Repository<Repo>
  let backup: IBackup

  const makeFakeUser = (): User => ({
    id: 1,
    email: 'any_email',
    password: 'any_password',
    name: 'any_user',
    admin: false
  })

  beforeAll(async () => {
    const db = await makeFakeDb([Repo, Log])
    backup = db.backup()
    UserRepo = getRepository(Repo)
  })

  beforeEach(async () => {
    backup.restore()
    sut = new UserRepository()
    await UserRepo.save(makeFakeUser() as any)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('List', () => {
    it('should return users', async () => {
      const account = await sut.get()
      expect(account).toHaveLength(1)
    })

    it('should return undefined if users table are empty', async () => {
      backup.restore()
      const users = await sut.get()
      expect(users).toEqual([])
    })
  })

  describe('Show', () => {
    it('should return an user if id exists', async () => {
      const user = await sut.show({ id: '1' })
      expect(user?.id).toBe(1)
    })

    it('should return undefined if user does not exists on show', async () => {
      const user = await sut.show({ id: '0' })
      expect(user).toBeUndefined()
    })
  })
  describe('Delete', () => {
    it('should delete an user if id exists', async () => {
      await sut.delete({ id: '1' })
      const user = await sut.show({ id: '1' })
      expect(user).toBeUndefined()
    })

    it('should return undefined if user does not exists on delete function', async () => {
      const user = await sut.delete({ id: '0' })
      expect(user).toBeUndefined()
    })
  })

  describe('Create', () => {
    it('should create an user if id is undefined', async () => {
      await sut.insert({
        email: 'any_email2',
        name: 'any_name2',
        password: 'any_password'
      })
      const User = await UserRepo.count()
      expect(User).toBe(2)
    })
  })

  describe('Update', () => {
    it('should update an user if id is defined', async () => {
      const user = await sut.update({ id: '1', email: 'update_email' })
      expect(user).toMatchObject({ id: 1, email: 'update_email' })
    })
  })
})
