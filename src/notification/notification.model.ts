import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NotificationType } from '@prisma/client'
import { PostReaction } from 'src/post/post-reaction.model'
import { TagReaction } from 'src/tag/tag-reaction.model'

import { User } from '../user/user.model'

@ObjectType()
class Follower {
  @Field(() => ID)
  id: string
  followee?: User | null
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
})

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string
  isSeen?: boolean
  createdAt: Date
  postReaction?: PostReaction | null
  tagReaction?: TagReaction | null
  follower?: Follower | null
  date?: Date | null
  @Field(() => NotificationType)
  type?: NotificationType
}
