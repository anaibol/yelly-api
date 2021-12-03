import { Int, Field, ObjectType } from '@nestjs/graphql'
import { UserTraining } from '../user-training/userTraining.model'
import { Post } from '../post/post.model'
import { User } from './user.model'

@ObjectType()
export class Me {
  @Field()
  id: string

  @Field()
  email: string

  @Field()
  firstName?: string

  @Field()
  lastName?: string

  @Field(() => Date, { nullable: true })
  birthdate?: string

  @Field({ nullable: true })
  pictureId?: string

  @Field({ nullable: true })
  snapchat?: string

  @Field({ nullable: true })
  instagram?: string

  @Field({ defaultValue: 0 })
  unreadNotificationsCount: number

  @Field({ nullable: true })
  isFilled?: boolean

  @Field({ nullable: true })
  sendbirdAccessToken?: string

  @Field({ nullable: true })
  about?: string

  @Field({ nullable: true })
  locale?: string

  @Field(() => UserTraining, { nullable: true })
  userTraining?: UserTraining

  @Field(() => [Post], { nullable: true })
  posts?: Post[]

  @Field(() => Int)
  followersCount: number

  @Field(() => Int)
  followeesCount: number

  @Field(() => [User])
  followees: User

  @Field(() => [User])
  followers: User
}
