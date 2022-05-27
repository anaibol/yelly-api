import { Injectable } from '@nestjs/common'
import { Post, PostReaction, Tag } from '@prisma/client'
import { differenceInHours } from 'date-fns'
import { orderBy } from 'lodash'
import { PrismaService } from '../core/prisma.service'

@Injectable()
export class RankingService {
  constructor(private prismaService: PrismaService) {}

  getPostScore(children: Post[], reactions: PostReaction[], createdAt: Date): number {
    const hoursAgo = -differenceInHours(createdAt, new Date())

    const timingScore = hoursAgo < 24 ? 24 - hoursAgo : 0

    const repliesScore: number = children
      .map(({ createdAt }) => {
        const hoursAgo = -differenceInHours(createdAt, new Date())

        return hoursAgo < 24 ? 24 - hoursAgo + 1 : 0.5
      })
      .reduce((a, b) => a + b, 0)

    const reactionsScore: number = reactions
      .map(({ createdAt }) => {
        const hoursAgo = -differenceInHours(createdAt, new Date())

        return hoursAgo < 24 ? 24 - hoursAgo + 0.2 : 0.1
      })
      .reduce((a, b) => a + b, 0)

    return Math.round(timingScore + repliesScore + reactionsScore)
  }

  async recalculateTagRank(tag: Tag) {
    const posts = await this.prismaService.post.findMany({
      where: {
        parent: null,
        tags: {
          some: {
            id: tag.id,
          },
        },
      },
      include: {
        reactions: true,
        children: true,
        tags: true,
        ranks: {
          where: {
            tagId: tag.id,
          },
        },
      },
    })

    const scoredPosts: { postId: string; tagId: string; previousPosition: number | null; score: number }[] = posts.map(
      (post) => {
        const score = this.getPostScore(post.children, post.reactions, post.createdAt)

        return {
          postId: post.id,
          tagId: tag.id,
          score,
          previousPosition: post.ranks.length ? post.ranks[0].previousPosition : null,
        }
      }
    )

    const sortedScoredPosts = orderBy(scoredPosts, ['score'], ['desc'])

    const ranks = sortedScoredPosts.map(({ postId, tagId, score, previousPosition }, index) => {
      const position = index + 1

      return {
        postId,
        tagId,
        score,
        previousPosition,
        position,
      }
    })

    return await this.prismaService.$transaction([
      this.prismaService.postTagRank.deleteMany({
        where: {
          tagId: tag.id,
        },
      }),
      this.prismaService.postTagRank.createMany({
        data: ranks,
      }),
    ])
  }
}
