import { ArgsType, Field, Int } from '@nestjs/graphql';
import { DEFAULT_LIMIT } from '../constants/pagination.constant';

@ArgsType()
export class PaginationArgs {
  @Field((type) => Int)
  offset: number = 0;

  @Field((type) => Int)
  limit: number = DEFAULT_LIMIT;
}
