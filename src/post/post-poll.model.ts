import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PostPollOption {
  @Field(() => ID)
  id: string
  text: string
  votesCount: number
  isAuthUserVote?: boolean
}

@ObjectType()
export class PostPoll {
  @Field(() => ID)
  id: string
  options: PostPollOption[]
}
