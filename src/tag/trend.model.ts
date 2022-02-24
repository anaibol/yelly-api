import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'

@ObjectType()
export class Trend {
  @Field(() => ID)
  id: string
  text: string
  author?: User | null
  postCount?: number
  lastUsers?: User[]
}
