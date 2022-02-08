import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { UserService } from '../user/user.service'

import { CreateLiveTagInput } from '../post/create-live-tag.input'
import { LiveTagAuthUser } from '../post/live-tag-auth-user.model'
import { PostsArgs } from '../post/posts.args'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagArgs } from './tag.args'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelect } from '../post/post-select.constant'
import { PaginatedPosts } from 'src/post/paginated-posts.model'

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private userService: UserService, private prismaService: PrismaService) {}

  @UseGuards(AuthGuard)
  @Query(() => LiveTagAuthUser, { name: 'liveTag', nullable: true })
  async getLiveTag(@CurrentUser() authUser: AuthUser): Promise<LiveTagAuthUser> {
    const liveTag = await this.tagService.getLiveTag()

    if (!liveTag) return

    const authUserPosted = await this.userService.hasUserPostedOnTag(authUser.id, liveTag.text)

    return { ...liveTag, authUserPosted }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  createLiveTag(@Args('input') createLiveTag: CreateLiveTagInput, @CurrentUser() authUser: AuthUser): Promise<Tag> {
    return this.tagService.createLiveTag(createLiveTag.text, authUser.id)
  }

  @Query(() => Tag)
  @UseGuards(AuthGuard)
  async tag(@Args() tagArgs: TagArgs) {
    return this.tagService.findById(tagArgs)
  }

  @ResolveField()
  async posts(@Parent() tag: Tag, @Args() postsArgs: PostsArgs): Promise<PaginatedPosts> {
    const { limit, after } = postsArgs

    const items = await this.prismaService.tag.findUnique({ where: { id: tag.id } }).posts({
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

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
