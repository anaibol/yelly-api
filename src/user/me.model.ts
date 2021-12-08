import { Int, Field, ObjectType } from '@nestjs/graphql'
import { User } from './user.model'
import { Post } from '../post/post.model'
import { School } from './school.model'
import { Training } from './training.model'

@ObjectType()
export class Me {
  @Field()
  id: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
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

  @Field(() => Training, { nullable: true })
  training?: Training

  @Field(() => School, { nullable: true })
  school?: School

  @Field(() => [Post], { nullable: true })
  posts?: Post[]

  @Field(() => Int, { nullable: true })
  followersCount: number

  @Field(() => Int, { nullable: true })
  followeesCount: number

  @Field(() => [User], { nullable: true })
  followees: User

  @Field(() => [User], { nullable: true })
  followers: User
}
