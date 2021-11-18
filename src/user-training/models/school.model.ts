import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class School {
  @Field()
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  googlePlaceId: string
}
