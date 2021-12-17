import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ExpoPushNotificationsToken {
  @Field()
  id: string

  @Field()
  userId: string

  @Field()
  token: string
}
