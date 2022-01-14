import { InputType } from '@nestjs/graphql'

@InputType()
export class DeletePostInput {
  id: string
}
