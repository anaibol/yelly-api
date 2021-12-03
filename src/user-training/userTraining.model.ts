import { Field, ObjectType } from '@nestjs/graphql'
import { School } from './school.model'
import { Training } from './training.model'

@ObjectType()
export class UserTraining {
  @Field()
  id: string

  @Field({ nullable: true })
  createdAt?: Date

  @Field({ nullable: true })
  updatedAt?: Date

  @Field(() => Training, { nullable: true })
  training?: Training

  @Field(() => School, { nullable: true })
  school?: School
}
