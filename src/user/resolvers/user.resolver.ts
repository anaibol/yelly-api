import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from 'src/post/models/post.model';
import { PostService } from 'src/post/services/post.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private UsersService: UserService,
    private postsService: PostService,
  ) {}

  // @Query((returns) => User, { name: 'user' })
  // async getUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.UsersService.findOneById(id);
  // }

  // @ResolveField('posts', (returns) => [Post])
  // async getPosts(@Parent() user: User) {
  //   const { id } = user;
  //   return this.postsService.findAll({ userId: id });
  // }
}
