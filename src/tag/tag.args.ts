import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class TagArgs {
  @Field({ nullable: true })
  id?: string
}
