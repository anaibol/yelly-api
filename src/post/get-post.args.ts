import { ArgsType } from '@nestjs/graphql'

@ArgsType()
export class GetPostArgs {
  id: string
}
