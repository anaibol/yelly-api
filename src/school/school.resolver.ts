import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'
import { CACHE_MANAGER, Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { School } from './school.model'
import { SchoolService } from './school.service'
import { PostsArgs } from '../post/posts.args'
import { SchoolArgs } from './school.args'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelect } from '../post/post-select.constant'

@Resolver(School)
export class SchoolResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private schoolService: SchoolService,
    private prismaService: PrismaService
  ) {}

  @Query(() => School, { nullable: true })
  async school(@Args() SchoolArgs?: SchoolArgs) {
    const { id, googlePlaceId } = SchoolArgs

    return this.schoolService.getSchool(id, googlePlaceId)
  }

  @ResolveField()
  async posts(@Parent() school: School, @Args() postsArgs?: PostsArgs) {
    const cacheKey = 'schoolPosts:' + JSON.stringify(postsArgs)
    const previousResponse = await this.cacheManager.get(cacheKey)

    if (previousResponse) return previousResponse

    const { after, limit } = postsArgs

    const posts = await this.prismaService.school.findUnique({ where: { id: school.id } }).posts({
      ...(after && {
        cursor: {
          createdAt: new Date(+after).toISOString(),
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: PostSelect,
    })

    const formattedPosts = posts.map((post) => ({
      ...post,
      totalReactionsCount: post._count.reactions,
      totalCommentsCount: post._count.comments,
    }))

    const nextCursor = posts.length === limit ? posts[limit - 1].createdAt.getTime().toString() : ''
    const response = { items: formattedPosts, nextCursor }
    this.cacheManager.set(cacheKey, response, { ttl: 5 })

    return response
  }
}
