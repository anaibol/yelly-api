import { InputType } from '@nestjs/graphql'

@InputType()
export class CreatePostInput {
  text: string
  tags?: string[]
  pollOptions?: string[]
  expiresIn?: number
  expiresAt?: Date
}
