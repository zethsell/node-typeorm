import { Log, User, ErrorLog } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { app } from '@/main/config/app'
import request from 'supertest'
import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'

describe('Signup Routes', () => {
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([User, Log, ErrorLog])
    backup = db.backup()
  })

  beforeEach(() => {
    backup.restore()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  test('should return an account on success', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Marcio',
        email: 'marcio.rodrigues@boxti.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })
})
