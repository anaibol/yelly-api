import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class GetPostArgs {
  @Field()
  id: string
}
