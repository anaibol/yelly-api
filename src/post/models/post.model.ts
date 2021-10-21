import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tag } from './tag.model';

@ObjectType()
export class Post {
  @Field((type) => Int)
  id: number;

  @Field()
  text: string;

  @Field((type) => Int)
  userId: number;

  @Field()
  date: string;

  @Field((type) => [Tag], { nullable: true }) // TODO: try to figure out how to avoid doing this optional. Its just to avoid deadlock in the responses. tag => posts, posts => tag
  tags?: Tag[];
}
