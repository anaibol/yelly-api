import { ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'

@ObjectType()
export class PaginatedUsers {
  items: User[]
  nextSkip?: number
}
