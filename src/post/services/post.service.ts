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
    const posts = await this.prismaService.post.findMany({
      where: {
        ...whereConditions,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            birthdate: true,
            pictureId: true,
          },
        },
        tags: {
          select: {
            id: true,
            createdAt: true,
            text: true,
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                pictureId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    const mappedPosts = this.mapOwnerBufferIdToUUID(posts);

    return mappedPosts;
  }

  mapOwnerBufferIdToUUID(posts) {
    return posts.map((post) => {
      const postWithUUID = {
        ...post,
      };
      postWithUUID.owner.id = this.prismaService.mapBufferIdToString(
        post.owner.id,
      );

      postWithUUID.tags = post.tags.map((tag) => {
        const tagWithUUID = {
          ...tag,
        };
        tagWithUUID.owner.id = this.prismaService.mapBufferIdToString(
          tag.owner.id,
        );

        return tagWithUUID;
      });

      return postWithUUID;
    });
  }

  // TODO: Add return type, is not q expected result
  // INFO: the usernamen is the email, it's called like this to be consist with the name defined in the JWT
  async create(createPostInput: CreatePostInput, username: string) {
    const { text, tag: tagText } = createPostInput;

    const post = await this.prismaService.post.create({
      select: {
        id: true,
        text: true,
        createdAt: true,
        owner: true,
        tags: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            owner: true,
          },
        },
      },
      data: {
        text,
        owner: {
          connect: {
            email: username,
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
                    email: username,
                  },
                },
              },
            },
          ],
        },
      },
    });

    // INFO: generate an array to reuse the same mapFunction
    const posts = [post];
    const mappedPost = this.mapOwnerBufferIdToUUID(posts)[0];

    this.tagService.syncTagIndexWithAlgolia(tagText, mappedPost);

    return mappedPost;
  }
}
