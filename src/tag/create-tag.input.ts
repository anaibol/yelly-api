import { Field, InputType } from '@nestjs/graphql'
import { TagType } from '@prisma/client'

@InputType()
export class CreateTagInput {
  tagText: string
  @Field(() => TagType)
  type: TagType
}
