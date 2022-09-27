import { InputType } from '@nestjs/graphql'

@InputType()
export class SignUpAndCreateTagInput {
  displayName: string
  tagText: string
}
