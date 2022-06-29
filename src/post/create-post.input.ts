import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePostInput {
  text: string
  tags?: string[]
  emojis?: string[]
  pollOptions?: string[]
  expiresIn?: number
  @Field(() => BigInt)
  parentId?: bigint
}
