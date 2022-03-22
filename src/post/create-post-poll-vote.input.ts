import { InputType } from '@nestjs/graphql'

@InputType()
export class CreatePostPollVoteInput {
  postId: string
  optionId: string
}
