import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { ActivityType } from '@prisma/client'

import { Post } from '../post/post.model'
import { Tag } from '../tag/tag.model'
import { User } from '../user/user.model'

registerEnumType(ActivityType, {
  name: 'ActivityType',
})

@ObjectType()
export class Activity {
  @Field(() => BigInt)
  id: BigInt
  tag?: Tag | null
  user?: User | null
  post?: Post | null
  createdAt?: Date
  @Field(() => ActivityType)
  type?: ActivityType
}

@ObjectType()
export class Activities {
  @Field(() => BigInt)
  nextCursor: BigInt | null
  items: Activity[]
  totalCount: number
}
