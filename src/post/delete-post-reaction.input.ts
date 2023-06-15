import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeletePostReactionInput {
  @Field(() => BigInt)
  postId: bigint
}
