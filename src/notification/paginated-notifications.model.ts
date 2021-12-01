import { Field, ObjectType } from '@nestjs/graphql'
import { Notification } from './notification.model'

@ObjectType()
export class PaginatedNotifications {
  @Field()
  nextCursor: string

  @Field(() => [Notification])
  items: Notification[]
}
