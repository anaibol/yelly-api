import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeletePostReactionInput {
  @Field()
  postId: string
}
