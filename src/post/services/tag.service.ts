import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { AlgoliaService } from 'src/core/services/algolia.service';
import { PrismaService } from 'src/core/services/prisma.service';
import { TagIndexAlgoliaInterface } from '../interfaces/tag-index-algolia.interface';

@Injectable()
export class TagService {
  constructor(
    private prismaService: PrismaService,
    private algoliaService: AlgoliaService,
  ) {}
  async syncTagIndexWithAlgolia(tagText: string, post: Post) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS');

    const tag = await this.prismaService.tag.findFirst({
      select: {
        createdAt: true,
        posts: {
          select: {
            owner: {
              select: {
                pictureId: true,
                firstName: true,
              },
            },
          },
          take: 5,
          distinct: 'ownerId',
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      where: {
        text: tagText,
      },
    });
    // INFO: Map data to fit Tag index algolia interface
    const lastUsers = tag.posts.map((lastPost) => lastPost.owner);
    const objectToUpdateOrCreate: TagIndexAlgoliaInterface = {
      text: tagText,
      lastUsers: [...lastUsers],
      postCount: {
        _operation: 'Increment',
        value: 1,
      },
      createdAtTimestamp: Date.parse(tag.createdAt.toString()),
      updatedAtTimestamp: Date.parse(post.createdAt.toString()),
      createdAt: tag.createdAt,
      updatedAt: post.createdAt,
    };

    return this.algoliaService.partialUpdateObject(
      algoliaTagIndex,
      objectToUpdateOrCreate,
      tagText,
    );
  }
}
