import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from '../../post/models/post.model';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  pictureId?: string;

  @Field((type) => [Post], { nullable: true })
  posts?: Post[];
}
