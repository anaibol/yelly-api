import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { UserService } from '../user/user.service'
import { CreateLiveTagInput } from './create-live-tag.input'
import { LiveTagAuthUser } from './live-tag-auth-user.model'
import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { AuthUser } from '../auth/auth.service'

@Resolver()
export class TagResolver {
  constructor(private tagService: TagService, private userService: UserService) {}

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
}
