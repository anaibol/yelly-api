import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Post } from '../../post/models/post.model'

@ObjectType()
export class User {
  @Field()
  id: string

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field({ nullable: true })
  birthdate?: string

  @Field({ nullable: true })
  pictureId?: string

  @Field({ nullable: true })
  snapchat?: string

  @Field({ nullable: true })
  instagram?: string

  @Field({ defaultValue: 0 })
  countNotifications?: number

  @Field({ nullable: true })
  isFilled?: boolean

  @Field({ nullable: true })
  sendbirdAccessToken?: string

  @Field({ nullable: true })
  about?: string

  @Field({ nullable: true })
  locale?: string

  /*
  @Field((type) => [Post], { nullable: true })
  userTrainings?: Post[];
  */

  @Field((type) => [Post], { nullable: true })
  posts?: Post[]
}
