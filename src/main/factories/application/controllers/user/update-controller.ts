import { UpdateUserController } from '@/application/controllers/user'
import { makeUpdateUser } from '@/main/factories/domain/usecases/user'

import { makeLogController } from '@/main/factories/application/decorators'
import { Controller } from '@/application/controllers'

export const makeUpdateUserController = (): Controller => {
  const controller = new UpdateUserController(makeUpdateUser())
  return makeLogController(controller)
}
