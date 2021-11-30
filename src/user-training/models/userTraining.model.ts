import { Field, ObjectType } from '@nestjs/graphql'
import { School } from 'src/user-training/models/school.model'
import { Training } from 'src/user-training/models/training.model'

@ObjectType()
export class UserTraining {
  @Field()
  id: string

  @Field()
  createdAt?: Date

  @Field()
  updatedAt?: Date

  @Field(() => Training, { nullable: true })
  training?: Training

  @Field(() => School, { nullable: true })
  school?: School
}
