import { InputType } from '@nestjs/graphql'

@InputType()
export class CreateLiveTagInput {
  text: string
}
