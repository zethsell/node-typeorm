import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeSignUpController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/auth/signup', adapt(makeSignUpController()))
}
