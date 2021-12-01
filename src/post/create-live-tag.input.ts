import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateLiveTagInput {
  @Field()
  text: string
}
