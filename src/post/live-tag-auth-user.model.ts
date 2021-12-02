import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class LastUsers {
  @Field()
  id: string

  @Field({ nullable: true })
  pictureId: string

  @Field()
  firstName: string
}

@ObjectType()
export class LiveTagAuthUser {
  @Field()
  id: string

  @Field()
  text: string

  @Field()
  authUserPosted: boolean

  @Field()
  postCount: number

  @Field(() => [LastUsers], { nullable: true })
  lastUsers: LastUsers[]
}
