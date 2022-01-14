import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Country {
  @Field(() => ID)
  id: string
  name: string
}
