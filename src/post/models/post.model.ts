import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Tag } from './tag.model';

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field()
  createdAt: string;

  @Field()
  ownerId: string;

  @Field((type) => [Tag], { nullable: true }) // TODO: try to figure out how to avoid doing this optional. Its just to avoid deadlock in the responses. tag => posts, posts => tag
  tags?: Tag[];

  @Field((type) => User, { nullable: true })
  owner?: User;
}
