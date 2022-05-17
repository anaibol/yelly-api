import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PostReaction {
  @Field(() => ID)
  id: string
  text: string
  authorId: string
}
