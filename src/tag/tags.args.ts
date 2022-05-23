import { ArgsType } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

@ArgsType()
export class TagsArgs extends OffsetPaginationArgs {
  isEmoji: boolean = false
}
