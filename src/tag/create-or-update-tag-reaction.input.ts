import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateOrUpdateTagReactionInput {
  @Field(() => BigInt)
  tagId: bigint
  text: string
}
