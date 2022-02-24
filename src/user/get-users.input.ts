import { ArgsType } from '@nestjs/graphql'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'

@ArgsType()
export class GetUsersArgs extends CursorPaginationArgs {}
