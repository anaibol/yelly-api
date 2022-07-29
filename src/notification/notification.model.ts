import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NotificationType } from '@prisma/client'
import { PostReaction } from 'src/post/post-reaction.model'
import { TagReaction } from 'src/tag/tag-reaction.model'

import { Post } from '../post/post.model'
import { Tag } from '../tag/tag.model'
import { User } from '../user/user.model'

registerEnumType(NotificationType, {
  name: 'NotificationType',
})

@ObjectType()
export class PostUserMention {
  @Field(() => BigInt)
  id: bigint
  post?: Post | null
}

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string
  isSeen?: boolean
  createdAt: Date
  postReaction?: PostReaction | null
  tagReaction?: TagReaction | null
  followerUser?: User | null
  tag?: Tag | null
  post?: Post | null
  newPostCount?: number | null
  postUserMention?: PostUserMention | null
  @Field(() => NotificationType)
  type?: NotificationType
}
