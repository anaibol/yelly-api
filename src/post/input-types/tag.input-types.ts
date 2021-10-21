import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  text: string;

  @Field((type) => Int)
  userId: number;

  @Field()
  tag: string;
}
