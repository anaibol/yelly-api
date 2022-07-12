import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateOrUpdatePostReactionInput {
  @Field(() => BigInt)
  postId: bigint
  text: string
}
