import { User, Log } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { app } from '@/main/config/app'
import request from 'supertest'
import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'

describe('Login Route', () => {
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([User, Log])
    backup = db.backup()
  })

  beforeEach(() => {
    backup.restore()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  it('should return unauthorized on login fail', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid_email@mail.com',
        password: 'invalid_password'

      })
      .expect(401)
  })
})
