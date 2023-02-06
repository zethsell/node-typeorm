export interface LoadUserAccount {
  load: (params: LoadUserAccount.Input) => Promise<LoadUserAccount.Output>
}

export namespace LoadUserAccount {
  export type Input = { email: string }

  export type Output = {
    id: string
    name?: string
    createdAt?: string | null
    updatedAt?: string | null
  }
}

export interface SaveFacebookAccount {
  saveWithFacebook: (params: SaveFacebookAccount.Input) => Promise<SaveFacebookAccount.Output>
}

export namespace SaveFacebookAccount {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId: string
  }

  export type Output = { id: string }
}
