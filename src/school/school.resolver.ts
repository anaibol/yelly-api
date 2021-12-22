import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'
import { PostService } from 'src/post/post.service'
import { CACHE_MANAGER, Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { School } from './school.model'
import { SchoolService } from './school.service'
import { PrismaService } from 'src/core/prisma.service'
import { GetPostsArgs } from '../post/get-posts.args'

@Resolver(School)
export class SchoolResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
    private postService: PostService,
    private schoolService: SchoolService
  ) {}

  @Query(() => School, { nullable: true })
  async getSchool(@Args({ name: 'schoolId', type: () => String }) schoolId) {
    return this.schoolService.getSchool(schoolId)
  }

  @ResolveField()
  async posts(@Parent() school: School, @Args() GetPostsArgs?: GetPostsArgs) {
    const cacheKey = 'school:' + JSON.stringify(GetPostsArgs)
    const previousResponse = await this.cacheManager.get(cacheKey)

    if (previousResponse) return previousResponse

    const { posts, cursor } = await this.postService.find(
      null,
      GetPostsArgs.userId,
      school.id,
      GetPostsArgs.after,
      GetPostsArgs.limit
    )

    const response = { items: posts, nextCursor: cursor }

    this.cacheManager.set(cacheKey, response, { ttl: 5 })

    return response
  }
}
