import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { ActivityType } from '@prisma/client'
import { Post } from 'src/post/post.model'

registerEnumType(ActivityType, {
  name: 'ActivityType',
})

@ObjectType()
export class Activity {
  @Field(() => BigInt)
  id: BigInt
  post?: Post
  createdAt?: Date
  date?: Date | null
  @Field(() => ActivityType)
  type?: ActivityType | null
}

@ObjectType()
export class Activities {
  @Field(() => BigInt)
  nextCursor: BigInt | null
  items: Activity[]
  totalCount: number
}
