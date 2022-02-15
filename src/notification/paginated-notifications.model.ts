import { Field, ObjectType } from '@nestjs/graphql'
import { Notification } from './notification.model'

@ObjectType()
export class PaginatedNotifications {
  nextCursor: string
  items: Notification[]
}
