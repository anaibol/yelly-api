import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateOrUpdatePostReactionInput {
  @Field()
  postId: string

  @Field()
  reaction: string
}
