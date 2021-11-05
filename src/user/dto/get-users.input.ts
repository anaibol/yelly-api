import { ArgsType, Field } from '@nestjs/graphql'
import { PaginationArgs } from 'src/common/dto/pagination.args'

@ArgsType()
export class GetUsersArgs extends PaginationArgs {}
