import { InputType } from '@nestjs/graphql'

@InputType()
export class CreateTagInput {
  tagText: string
}
