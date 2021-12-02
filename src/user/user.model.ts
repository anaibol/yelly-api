import { Int, Field, ObjectType } from '@nestjs/graphql'
import { UserTraining } from '../user-training/userTraining.model'
import { Post } from '../post/post.model'

@ObjectType()
export class User {
  @Field()
  id: string

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

  @Field({ nullable: true })
  about?: string

  @Field({ nullable: true })
  locale?: string

  @Field(() => UserTraining)
  userTraining?: UserTraining

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
}