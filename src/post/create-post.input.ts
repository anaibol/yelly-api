import { InputType } from '@nestjs/graphql'

@InputType()
export class CreatePostInput {
  text: string
  tags: string[]
}
