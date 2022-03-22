import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCommentInput {
  postId: string
  text: string
}
