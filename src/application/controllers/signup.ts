import { User } from '@/infra/repos/postgres/entities/user'
import { ValidationBuilder as builder, Validator } from '@/application/validation'
import { AddAccount } from '@/domain/entities'
import { HttpResponse, ok, badRequest } from '@/application/helpers'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export class SignUpController extends Controller {
  private readonly addAccount: AddAccount

  constructor (addAccount: AddAccount) {
    super()
    this.addAccount = addAccount
  }

  override async perform ({ name, email, password }: HttpRequest): Promise<HttpResponse> {
    try {
      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error: any) {
      return badRequest(error)
    }
  }

  override async buildValidators ({ name, email, password, passwordConfirmation }: HttpRequest): Promise<Validator[]> {
    return [
      ...builder.of({ value: name, fieldName: 'name' }).required().build(),
      ...(await builder.of({ value: email, fieldName: 'email' }).required().email().unique(User)).build(),
      ...builder.of({ value: password, fieldName: 'password' }).required().password(passwordConfirmation).build()
    ]
  }
}
