import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePostInput {
  text: string
  @Field(() => BigInt)
  tagId: bigint
  pollOptions?: string[]
  @Field(() => BigInt)
  parentId?: bigint
  mentionedUserIds?: string[]
}
