import { ArgsType } from '@nestjs/graphql'

@ArgsType()
export class SchoolArgs {
  id?: string
  googlePlaceId?: string
}
