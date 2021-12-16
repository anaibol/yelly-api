import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class GetTagArgs {
  @Field({ nullable: true })
  tagId?: string
}
