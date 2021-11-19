import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ToggleFollowInput {
  @Field()
  otherUserId: string
  @Field()
  value: boolean
}
