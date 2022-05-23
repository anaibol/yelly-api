import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateOrUpdatePostReactionInput {
  postId: string
  text: string
}
