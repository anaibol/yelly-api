import { Field, Float, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateTagInput {
  isHidden?: boolean
  @Field(() => Float)
  scoreFactor?: number
}
