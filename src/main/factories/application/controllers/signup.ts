import { SignUpController, Controller } from '@/application/controllers'
import { makeDbAddAccount } from '../../domain/usecases'
import { makeLogController } from '../decorators'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount())
  return makeLogController(controller)
}
