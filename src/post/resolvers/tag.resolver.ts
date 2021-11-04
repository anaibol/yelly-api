import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from 'src/user/services/user.service';
import { CreateLiveTagInput } from '../dto/create-live-tag.input';
import { LiveTagAuthUser } from '../models/live-tag-auth-user.model';
import { Tag } from '../models/tag.model';
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

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  async createLiveTag(
    @Args('input') createLiveTag: CreateLiveTagInput,
    @Context() context,
  ) {
    const liveTag = await this.tagService.createLiveTag(
      createLiveTag.text,
      context.req.username,
    );

    return liveTag;
  }
}
