import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Cache } from 'cache-manager'

import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { UserService } from '../user/user.service'

import { CreateLiveTagInput } from '../post/create-live-tag.input'
import { LiveTagAuthUser } from '../post/live-tag-auth-user.model'
import { GetPostsArgs } from '../post/get-posts.args'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { PostService } from '../post/post.service'
import { GetTagArgs } from './get-tag.args'

@Resolver(Tag)
export class TagResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private tagService: TagService,
    private userService: UserService,
    private postService: PostService
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
  async posts(@Parent() tag: Tag, @Args() GetPostsArgs?: GetPostsArgs) {
    const cacheKey = 'posts:' + JSON.stringify(GetPostsArgs)
    const previousResponse = await this.cacheManager.get(cacheKey)

    if (previousResponse) return previousResponse

    const { posts, cursor } = await this.postService.find(
      tag.text,
      GetPostsArgs.userId,
      GetPostsArgs.schoolId,
      GetPostsArgs.after,
      GetPostsArgs.limit
    )

    const response = { items: posts, nextCursor: cursor }

    this.cacheManager.set(cacheKey, response, { ttl: 5 })

    return response
  }
}
