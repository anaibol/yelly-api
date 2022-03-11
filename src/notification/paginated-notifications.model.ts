import { ObjectType } from '@nestjs/graphql'
import { Notification } from './notification.model'

@ObjectType()
export class PaginatedNotifications {
  items: Notification[]
  nextSkip?: number
}
