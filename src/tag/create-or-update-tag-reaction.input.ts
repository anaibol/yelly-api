import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateOrUpdateTagReactionInput {
  @Field(() => BigInt)
  tagId: bigint
  text: string
}

@InputType()
export class CreateAnonymousTagReactionInput {
  @Field(() => BigInt)
  tagId: bigint
}
