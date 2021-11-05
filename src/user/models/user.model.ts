import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Notification } from 'src/notification/models/notification.model'
import { UserTraining } from 'src/user-training/models/userTraining.model'
import { Post } from '../../post/models/post.model'

@ObjectType()
export class User {
  @Field()
  id: string

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field((type) => Date, { nullable: true })
  birthdate?: string

  @Field({ nullable: true })
  pictureId?: string

  @Field({ nullable: true })
  snapchat?: string

  @Field({ nullable: true })
  instagram?: string

  @Field({ defaultValue: 0 })
  unreadNotificationsCount?: number

  @Field({ nullable: true })
  isFilled?: boolean

  @Field({ nullable: true })
  sendbirdAccessToken?: string

  @Field({ nullable: true })
  about?: string

  @Field({ nullable: true })
  locale?: string

  @Field((type) => [UserTraining], { nullable: true })
  userTraining?: UserTraining[]

  @Field((type) => [Post], { nullable: true })
  posts?: Post[]
}
