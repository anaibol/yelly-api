import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PostReaction {
  @Field({ nullable: true })
  id: string

  @Field({ nullable: true })
  createdAt: string

  @Field()
  reaction: string

  @Field(() => String, { nullable: true })
  authorId: string

  @Field(() => String, { nullable: true })
  postId: string
}
