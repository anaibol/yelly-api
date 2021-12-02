import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SendbirdAccessToken {
  @Field()
  sendbirdAccessToken: string
}
