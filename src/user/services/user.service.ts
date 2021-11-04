import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async hasUserPostedOnTag(email, tagText) {
    const post = await this.prismaService.post.findFirst({
      select: {
        id: true,
      },
      where: {
        owner: {
          email: email,
        },
        tags: {
          some: {
            text: tagText,
          },
        },
      },
    });

    return post != null;
  }
}
