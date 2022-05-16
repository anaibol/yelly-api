import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PostReaction {
  reaction: string
  authorId: string
}
