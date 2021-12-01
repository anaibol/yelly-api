import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeletePostInput {
  @Field()
  id: string
}
