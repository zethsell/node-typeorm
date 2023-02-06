import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import { makeResetPasswordController } from '@/main/factories/application/controllers'
import {
  makeUpdateUserController,
  makeDeleteUserController,
  makeGetUserController,
  makeShowUserController,
  makeInsertUserController,
  makeLoggedUserController
} from '@/main/factories/application/controllers/user'

export default (router: Router): void => {
  router.get('/users', auth, adapt(makeGetUserController()))
  router.get('/users/:id', auth, adapt(makeShowUserController()))
  router.get('/users/me', auth, adapt(makeLoggedUserController()))
  router.post('/users/me', auth, adapt(makeLoggedUserController()))
  router.post('/users', auth, adapt(makeInsertUserController()))
  router.post('/reset-password', auth, adapt(makeResetPasswordController()))
  router.put('/users/:id', auth, adapt(makeUpdateUserController()))
  router.delete('/users/:id', auth, adapt(makeDeleteUserController()))
}
