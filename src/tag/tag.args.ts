import { ArgsType } from '@nestjs/graphql'

@ArgsType()
export class TagArgs {
  text: string
}
