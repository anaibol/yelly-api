import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FirebaseSignInInput {
  @Field()
  accessToken: string
}
