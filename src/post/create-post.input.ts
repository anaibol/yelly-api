import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePostInput {
  text: string
  tags?: string[]
  pollOptions?: string[]
  expiresIn?: number
  expiresAt?: Date
  @Field(() => ID)
  parentId?: string
}
