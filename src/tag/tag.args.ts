import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class TagArgs {
  text: string
  @Field({ nullable: true })
  postsAuthorBirthYear?: number
}
