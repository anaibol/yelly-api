import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class TagArgs {
  @Field({ nullable: true })
  text?: string
}
