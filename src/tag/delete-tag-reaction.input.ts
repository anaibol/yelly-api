import { InputType } from '@nestjs/graphql'

@InputType()
export class DeleteTagReactionInput {
  tagId: string
}
