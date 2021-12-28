import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'
import { CACHE_MANAGER, Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { School } from './school.model'
import { SchoolService } from './school.service'
import { GetPostsArgs } from '../post/get-posts.args'
import { GetSchoolArgs } from './get-school.args'
import { PrismaService } from 'src/core/prisma.service'
import { postSelect } from '../post/post.constant'

@Resolver(School)
export class SchoolResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private schoolService: SchoolService,
    private prismaService: PrismaService
  ) {}

  @Query(() => School, { nullable: true })
  async school(@Args() GetSchoolArgs?: GetSchoolArgs) {
    const { id, googlePlaceId } = GetSchoolArgs

    return this.schoolService.getSchool(id, googlePlaceId)
  }

  @ResolveField()
  async posts(@Parent() school: School, @Args() GetPostsArgs?: GetPostsArgs) {
    const cacheKey = 'schoolPosts:' + JSON.stringify(GetPostsArgs)
    const previousResponse = await this.cacheManager.get(cacheKey)

    if (previousResponse) return previousResponse

    const { after, limit } = GetPostsArgs

    const posts = await this.prismaService.school.findUnique({ where: { id: school.id } }).posts({
      ...(after && {
        cursor: {
          createdAt: new Date(+after).toISOString(),
        },
        skip: 1, // Skip the cursor
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: postSelect,
    })

    const formattedPosts = posts.map((post) => ({
      ...post,
      totalReactionsCount: post._count.reactions,
      totalCommentsCount: post._count.comments,
    }))

    const nextCursor = posts.length === limit ? posts[limit - 1].createdAt : ''
    const response = { items: formattedPosts, nextCursor }
    this.cacheManager.set(cacheKey, response, { ttl: 5 })

    return response
  }
}
