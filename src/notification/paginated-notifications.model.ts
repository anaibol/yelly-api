import { ObjectType } from '@nestjs/graphql'
import { Notification } from './notification.model'

@ObjectType()
export class PaginatedNotifications {
  nextSkip: number
  items: Notification[]
}
