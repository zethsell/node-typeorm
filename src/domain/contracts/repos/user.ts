export type User = {
  id: number
  name?: string
  email?: string
  password?: string
  admin?: boolean
  firstAccess?: Date
  lastAccess?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface LoadUsers {
  get: () => Promise<LoadUsers.Output>
}

export namespace LoadUsers {
  export type Output = User[]
}

export interface ShowUser {
  show: (input: ShowUser.Input) => Promise<ShowUser.Output>
}

export namespace ShowUser {
  export type Input = { id: string }
  export type Output = User | undefined
}

export interface ShowUserByEmail {
  showByEmail: (input: ShowUserByEmail.Input) => Promise<ShowUserByEmail.Output>
}

export namespace ShowUserByEmail {
  export type Input = { email: string}
  export type Output = User | undefined
}

export interface UpdateUser {
  update: (input: UpdateUser.Input) => Promise<UpdateUser.Output>
}

export namespace UpdateUser {
  export type Input = {
    id: string
    name?: string
    email?: string
    password?: string
    admin?: boolean
    firstAccess?: Date
    lastAccess?: Date
  }
  export type Output = User | undefined
}

export interface InsertUser {
  insert: (input: InsertUser.Input) => Promise<InsertUser.Output>
}

export namespace InsertUser {
  export type Input = {
    name: string
    email: string
    password: string
    admin?: boolean
    firstAccess?: Date
    lastAccess?: Date
  }
  export type Output = User | undefined
}

export interface DeleteUser {
  delete: (input: DeleteUser.Input) => Promise<DeleteUser.Output>
}

export namespace DeleteUser {
  export type Input = { id: string }
  export type Output<T = any> = T
}
