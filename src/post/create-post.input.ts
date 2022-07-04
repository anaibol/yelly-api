import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePostInput {
  text: string
  @Field(() => [BigInt])
  tagIds?: bigint[]
  pollOptions?: string[]
  @Field(() => BigInt)
  parentId?: bigint
}
