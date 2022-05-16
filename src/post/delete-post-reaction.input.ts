import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeletePostReactionInput {
  postId: string
}
