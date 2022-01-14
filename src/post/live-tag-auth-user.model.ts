import { ObjectType } from '@nestjs/graphql'

@ObjectType()
class LastUsers {
  id: string
  pictureId?: string
  firstName: string
}

@ObjectType()
export class LiveTagAuthUser {
  id: string
  text: string
  authUserPosted: boolean
  postCount: number
  lastUsers?: LastUsers[]
}
