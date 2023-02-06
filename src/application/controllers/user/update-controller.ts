import { ValidationBuilder as builder, Validator } from '@/application/validation'
import { HttpResponse, ok, badRequest } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { UpdateUser } from '@/domain/usecases/user'
import { UpdateUser as Save, User as IUser } from '@/domain/contracts/repos'

import { User } from '@/infra/repos/postgres/entities'

type HttpRequest = Save.Input & { passwordConfirmation?: string }

type Model = Error | IUser
export class UpdateUserController extends Controller {
  constructor (private readonly updateUser: UpdateUser) {
    super()
  }

  async perform ({ passwordConfirmation, ...data }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const user = await this.updateUser(data)
      return ok(user)
    } catch (error: any) {
      return badRequest(error)
    }
  }

  override async buildValidators ({ id, password, passwordConfirmation, email }: HttpRequest): Promise<Validator[]> {
    return [
      ...builder.of({ value: id, fieldName: 'id' }).required().build(),
      ...builder.of({ value: password, fieldName: 'password' }).sometimes().between(8, 20).password(passwordConfirmation).build(),
      ...(await builder.of({ value: { value: email, id }, fieldName: 'email' }).required().email().unique(User)).build()
    ]
  }
}
