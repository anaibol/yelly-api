import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';

@ArgsType()
export class GetPostsArgs extends PaginationArgs {
  @Field({ nullable: true })
  tag?: string;
}
