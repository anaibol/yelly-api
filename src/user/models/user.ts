import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from '../../post/models/post.model';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field((type) => [Post], { nullable: true }) // TODO: try to figure out how to avoid doing this optional. Its just to avoid deadlock in the responses. users => posts, posts => owners => users
  posts?: Post[];
}
