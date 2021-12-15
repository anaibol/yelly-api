import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCommentInput {
  @Field()
  postId: string

  @Field()
  text: string
}
