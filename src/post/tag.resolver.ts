import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser, JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UserService } from '../user/user.service'
import { CreateLiveTagInput } from './create-live-tag.input'
import { LiveTagAuthUser } from './live-tag-auth-user.model'
import { Tag } from './tag.model'
import { TagService } from './tag.service'

@Resolver()
export class TagResolver {
  constructor(private tagService: TagService, private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => LiveTagAuthUser, { name: 'liveTag' })
  async getLiveTag(@CurrentUser() currentUser) {
    const liveTag = await this.tagService.getLiveTag()

    const authUserPosted = await this.userService.hasUserPostedOnTag(currentUser.username, liveTag.text)

    return { ...liveTag, authUserPosted }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Tag)
  async createLiveTag(@Args('input') createLiveTag: CreateLiveTagInput, @CurrentUser() currentUser) {
    const liveTag = await this.tagService.createLiveTag(createLiveTag.text, currentUser.username)

    return liveTag
  }
}
