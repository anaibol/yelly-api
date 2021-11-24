import { Field, ObjectType } from '@nestjs/graphql'
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

  @Field(() => Date, { nullable: true })
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

  @Field(() => UserTraining)
  userTraining: UserTraining

  @Field(() => [Post], { nullable: true })
  posts?: Post[]

  @Field(() => Number, { nullable: true })
  followersCount

  @Field(() => Number, { nullable: true })
  followingCount

  @Field(() => [User], { nullable: true })
  followings: User

  @Field(() => [User], { nullable: true })
  followers: User
}
