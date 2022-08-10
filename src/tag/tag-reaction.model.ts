import { Field, ObjectType } from '@nestjs/graphql'

import { User } from '../user/user.model'
import { Tag } from './tag.model'

@ObjectType()
export class TagReaction {
  @Field(() => BigInt)
  id: BigInt
  text?: string
  author?: User | null
  tag?: Tag
}
