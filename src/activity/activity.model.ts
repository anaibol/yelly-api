import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { ActivityType } from '@prisma/client'

import { Tag } from '../tag/tag.model'

registerEnumType(ActivityType, {
  name: 'ActivityType',
})

@ObjectType()
export class Activity {
  @Field(() => BigInt)
  id: BigInt
  tag?: Tag
  createdAt?: Date
  date?: Date | null
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
