import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateOrUpdatePostReactionInput {
  postId: string
  reaction: string
}
