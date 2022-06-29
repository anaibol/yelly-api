import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteTagReactionInput {
  @Field(() => BigInt)
  tagId: bigint
}
