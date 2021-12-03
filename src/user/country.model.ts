import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Country {
  @Field()
  id: string

  @Field()
  name: string
}
