import { Injectable } from '@nestjs/common';
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constant';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreatePostInput } from '../dto/create-post.input';
import { TagService } from './tag.service';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private tagService: TagService,
  ) {}

  // TODO: Add return type, is not q expected result
  async find(tagText = '', offset = 0, limit = DEFAULT_LIMIT) {
    let whereConditions = {};

    if (tagText.length > 0) {
      whereConditions = {
        tags: {
          every: {
            text: tagText,
          },
        },
      };
    }
    return this.prismaService.post.findMany({
      where: {
        ...whereConditions,
      },
      include: {
        owner: {
          select: {
            pictureId: true,
          },
        },
        tags: {
          select: {
            text: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  // TODO: Add return type, is not q expected result
  async create(createPostInput: CreatePostInput) {
    const { text, ownerId: ownerIdString, tag: tagText } = createPostInput;
    const ownerId = this.prismaService.mapStringIdToBuffer(ownerIdString);

    const post = await this.prismaService.post.create({
      data: {
        text,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        tags: {
          connectOrCreate: [
            {
              where: {
                text: tagText,
              },
              create: {
                text: tagText,
                owner: {
                  connect: {
                    id: ownerId,
                  },
                },
              },
            },
          ],
        },
      },
    });

    this.tagService.syncTagIndexWithAlgolia(tagText, post);

    return post;
  }
}
