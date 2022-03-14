import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class OffsetPaginationArgs {
  @Field(() => Number)
  skip = 0
  @Field(() => Number)
  limit = 10
}
