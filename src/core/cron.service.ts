import { BullQueueInject, BullWorker, BullWorkerProcess } from '@anchan828/nest-bullmq'
import { Injectable } from '@nestjs/common'
import { Post, PostReaction } from '@prisma/client'
import { Job, Queue } from 'bullmq'
import { differenceInHours } from 'date-fns'
import { orderBy, sortBy } from 'lodash'
import { PrismaService } from './prisma.service'

const APP_QUEUE = 'APP_QUEUE'

@Injectable()
export class CronQueue {
  constructor(
    @BullQueueInject(APP_QUEUE)
    private readonly queue: Queue
  ) {}
}

const getPostScore = (children: Post[], reactions: PostReaction[], createdAt: Date): number => {
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

  return timingScore + repliesScore + reactionsScore
}

@BullWorker({ queueName: APP_QUEUE })
export class CronWorker {
  constructor(private prismaService: PrismaService) {}

  @BullWorkerProcess()
  public async process(job: Job): Promise<{ status: string }> {
    if (process.env.NODE_ENV === 'development' || !process.env.REDIS_HOST || !process.env.REDIS_PORT)
      return Promise.resolve({ status: '' })

    console.log('APP_QUEUE CRON RUN', { date: new Date() })

    const posts = await this.prismaService.post.findMany({
      where: {
        parent: null,
      },
      include: {
        reactions: true,
        children: true,
        tags: true,
        ranks: true,
      },
    })

    const scoredPosts: { postId: string; previousPosition: number | null; score: number }[] = posts.map((post) => {
      const score = getPostScore(post.children, post.reactions, post.createdAt)

      return { postId: post.id, score, previousPosition: post.ranks[0].previousPosition }
    })

    const sortedScoredPosts = orderBy(scoredPosts, ['score'], ['desc'])

    const ranks = sortedScoredPosts.map(({ postId, score, previousPosition }, index) => {
      return {
        postId,
        score,
        position: index,
      }
    })

    await this.prismaService.postTagRank.updateMany({
      data: [ranks],
    })

    return { status: 'ok' }
  }
}
