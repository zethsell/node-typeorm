import { Router } from 'express'
import { makeLoginController, makeLoginAdminController } from '@/main/factories/application/controllers'
import { adaptExpressRoute as adapt } from '@/main/adapters'

export default (router: Router): void => {
  router.post('/auth/login', adapt(makeLoginController()))
  router.post('/auth/login-admin', adapt(makeLoginAdminController()))
}
