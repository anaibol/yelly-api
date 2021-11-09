import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Training {
  @Field()
  id: string

  @Field()
  name: string
}
