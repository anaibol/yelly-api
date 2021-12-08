import { Int, Field, ObjectType } from '@nestjs/graphql'
import { Post } from '../post/post.model'
import { School } from './school.model'
import { Training } from './training.model'

// @ObjectType()
// export class Followship {
//   @Field()
//   isFollowingAuthUser?: boolean

//   // @Field({ nullable: true })
//   // user: User
// }

@ObjectType()
export class User {
  @Field()
  id: string

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
  followersCount?: number

  @Field(() => Int, { nullable: true })
  followeesCount?: number

  @Field(() => [User], { nullable: true })
  followees?: User

  @Field(() => [User], { nullable: true })
  followers?: User
  // @Field(() => [Followship], { nullable: true })
  // followees?: Followship

  // @Field(() => [Followship], { nullable: true })
  // followers?: Followship

  @Field(() => Boolean, { nullable: true })
  isFollowingAuthUser?: boolean
}
