import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Training {
  @Field(() => ID)
  id: string
  name: string
}
