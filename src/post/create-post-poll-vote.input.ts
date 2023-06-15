import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePostPollVoteInput {
  @Field(() => BigInt)
  postId: bigint
  @Field(() => BigInt)
  optionId: bigint
}
