import { Controller, Post, Body } from '@nestjs/common'
import { Field, ObjectType } from '@nestjs/graphql'
import { NotificationService } from '../notification.service'

@ObjectType()
export class Notification {
  @Field()
  category: string
}

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('/chat-message')
  async chatMessage(@Body() body: Notification): Promise<Notification> {
    this.notificationService.chatMessage(body)
    return body
  }
}
