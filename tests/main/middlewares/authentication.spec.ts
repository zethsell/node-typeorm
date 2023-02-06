import { env } from '@/main/config/env'
import { app } from '@/main/config/app'
import { auth } from '@/main/middlewares'
import { ForbiddenError } from '@/application/errors'

import { sign } from 'jsonwebtoken'
import request from 'supertest'

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header is missing', async () => {
    app.get('/fake_route', auth)

    const { status, body } = await request(app)
      .get('/fake_route')
      .send({ token: 'valid_token' })

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })

  it('should return 200 if authorization header is valid', async () => {
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret)

    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })

    const { status, body } = await request(app)
      .get('/fake_route')
      .set({ authorization })

    expect(status).toBe(200)
    expect(body).toEqual({ authUserId: 'any_user_id' })
  })
})
