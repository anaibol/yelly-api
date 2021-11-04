import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../../user/models/user.model'
import { Tag } from './tag.model'

@ObjectType()
export class Post {
  @Field()
  id: string

  @Field()
  text: string

  @Field()
  createdAt: string

  @Field((type) => [Tag])
  tags: Tag[]

  @Field((type) => User)
  owner: User
}
