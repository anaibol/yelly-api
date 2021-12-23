import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FirebaseSignUpInput {
  @Field()
  phoneNumber: string
}
