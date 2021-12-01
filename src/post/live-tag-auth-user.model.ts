import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LiveTagAuthUser {
  @Field()
  id: string

  @Field()
  text: string

  @Field()
  authUserPosted: boolean
}
