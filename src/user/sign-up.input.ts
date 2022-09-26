import { InputType } from '@nestjs/graphql'

@InputType()
export class SignUpInput {
  displayName: string
}
