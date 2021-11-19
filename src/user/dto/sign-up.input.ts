import { Field, InputType } from '@nestjs/graphql'
import { CreateUserTrainingInput } from 'src/user-training/dto/create-user-training.input'
import { UserCreateInput } from './create-user.input'

@InputType()
export class SignUpInput {
  @Field()
  user: UserCreateInput

  @Field()
  userTraining: CreateUserTrainingInput
}
