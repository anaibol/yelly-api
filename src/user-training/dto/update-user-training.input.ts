import { Field, InputType } from '@nestjs/graphql'
import { CreateSchoolInput } from 'src/user-training/dto/create-school.input'
import { CreateCityInput } from './create-city.input'

@InputType()
export class UpdateUserTrainingInput {
  @Field({ nullable: true })
  training?: string

  @Field({ nullable: true })
  dateBegin?: Date

  @Field({ nullable: true })
  city?: CreateCityInput

  @Field({ nullable: true })
  school?: CreateSchoolInput
}
