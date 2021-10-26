import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Post } from './post.model';

@ObjectType()
export class Tag {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field()
  createdAt: string;

  @Field((type) => User)
  owner: User;

  @Field((type) => [Post])
  posts: Post[];
}
