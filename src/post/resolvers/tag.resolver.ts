import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from 'src/user/services/user.service';
import { LiveTagAuthUser } from '../models/live-tag-auth-user.model';
import { TagService } from '../services/tag.service';

@Resolver()
export class TagResolver {
  constructor(
    private tagService: TagService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => LiveTagAuthUser, { name: 'liveTag' })
  async getLiveTag(@Context() context) {
    const liveTag = await this.tagService.getLiveTag();

    const authUserPosted = await this.userService.hasUserPostedOnTag(
      context.req.username,
      liveTag.text,
    );

    return { ...liveTag, authUserPosted };
  }
}
