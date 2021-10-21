import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user';
import { Post } from './post.model';

@ObjectType()
export class Tag {
  @Field((type) => Int)
  id: number;

  @Field()
  text: string;

  @Field((type) => User)
  owner: User;

  @Field((type) => [Post], { nullable: true }) // TODO: try to figure out how to avoid doing this optional. Its just to avoid deadlock in the responses. tag => posts, posts => tag
  posts?: Post[];
}
