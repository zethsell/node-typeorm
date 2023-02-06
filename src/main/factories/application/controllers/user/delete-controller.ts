import { DeleteUserController } from '@/application/controllers/user'
import { makeDeleteUser } from '@/main/factories/domain/usecases/user'

import { makeLogController } from '@/main/factories/application/decorators'
import { Controller } from '@/application/controllers'

export const makeDeleteUserController = (): Controller => {
  const controller = new DeleteUserController(makeDeleteUser())
  return makeLogController(controller)
}
