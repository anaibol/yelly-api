import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FirebaseSignInInput {
  @Field()
  idToken: string
}
