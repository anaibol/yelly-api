import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class GetSchoolArgs {
  @Field({ nullable: true })
  id?: string
  @Field({ nullable: true })
  googlePlaceId?: string
}
