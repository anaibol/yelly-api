import { InputType } from '@nestjs/graphql'

@InputType()
export class SignUpAndCreateTagInput {
  userDisplayName: string
  tagText: string
}
