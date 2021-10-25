import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  text: string;

  @Field()
  ownerId: string;

  @Field()
  tag: string;
}
