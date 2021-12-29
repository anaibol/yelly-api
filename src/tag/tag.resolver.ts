import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Cache } from 'cache-manager'

import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { UserService } from '../user/user.service'

import { CreateLiveTagInput } from '../post/create-live-tag.input'
import { LiveTagAuthUser } from '../post/live-tag-auth-user.model'
import { PostsArgs } from '../post/posts.args'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { GetTagArgs } from './get-tag.args'
import { PrismaService } from 'src/core/prisma.service'
import { postSelect } from '../post/post.constant'

@Resolver(Tag)
export class TagResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private tagService: TagService,
    private userService: UserService,
    private prismaService: PrismaService
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => LiveTagAuthUser, { name: 'liveTag', nullable: true })
  async getLiveTag(@CurrentUser() authUser: AuthUser) {
    const liveTag = await this.tagService.getLiveTag()

    if (!liveTag) return

    const authUserPosted = await this.userService.hasUserPostedOnTag(authUser.id, liveTag.text)

    return { ...liveTag, authUserPosted }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  createLiveTag(@Args('input') createLiveTag: CreateLiveTagInput, @CurrentUser() authUser: AuthUser) {
    return this.tagService.createLiveTag(createLiveTag.text, authUser.id)
  }

  @Query(() => Tag)
  @UseGuards(AuthGuard)
  async tag(@Args() getTagArgs: GetTagArgs) {
    return this.tagService.findById(getTagArgs)
  }

  @ResolveField()
  async posts(@Parent() tag: Tag, @Args() PostsArgs?: PostsArgs) {
    const cacheKey = 'tagPosts:' + JSON.stringify({ PostsArgs, tag })
    const previousResponse = await this.cacheManager.get(cacheKey)

    if (previousResponse) return previousResponse

    const { limit, after } = PostsArgs

    const posts = await this.prismaService.tag.findUnique({ where: { id: tag.id } }).posts({
      where: {
        ...(tag.text && {
          tags: {
            every: {
              text: tag.text,
            },
          },
        }),
      },
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
