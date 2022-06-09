/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { PrismaClient } from '.prisma/client'
import { sub } from 'date-fns'

async function main() {
  const prisma = new PrismaClient()

  const postReactions = await prisma.postReaction.findMany({
    where: {
      createdAt: {
        gt: sub(new Date(), { days: 1 }),
      },
    },
    include: {
      post: {
        include: {
          tags: true,
        },
      },
    },
  })

  await prisma.feedEvent.createMany({
    data: postReactions.map(({ id, createdAt, post }) => ({
      createdAt,
      type: 'POST_REACTION_CREATED' as const,
      postReactionId: id,
      postId: post.id,
      tagId: post.tags[0].id,
    })),
  })

  const postReplies = await prisma.post.findMany({
    where: {
      parentId: {
        not: null,
      },
      createdAt: {
        gt: sub(new Date(), { days: 1 }),
      },
    },
    include: {
      parent: {
        include: {
          tags: true,
        },
      },
    },
  })

  await prisma.feedEvent.createMany({
    data: postReplies.map(({ id, createdAt, parent }) => ({
      createdAt,
      type: 'POST_REPLY_CREATED' as const,
      postId: id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tagId: parent!.tags[0].id,
    })),
  })

  const newPosts = await prisma.post.findMany({
    where: {
      createdAt: {
        gt: sub(new Date(), { days: 1 }),
      },
      parentId: null,
    },
    include: {
      tags: true,
    },
  })

  await prisma.feedEvent.createMany({
    data: newPosts.map(({ id, createdAt, tags }) => ({
      createdAt,
      type: 'POST_CREATED' as const,
      postId: id,
      tagId: tags[0].id,
    })),
  })
}

main()
