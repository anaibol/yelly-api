/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { PrismaClient } from '.prisma/client'
import { FeedEventType } from '@prisma/client'
import { sub } from 'date-fns'

async function main() {
  const prisma = new PrismaClient()

  await prisma.feedEvent.deleteMany({})

  const postReactions = await prisma.postReaction.findMany({
    where: {
      createdAt: {
        gt: sub(new Date(), { days: 1 }),
      },
    },
    include: {
      author: true,
      post: {
        include: {
          tags: true,
        },
      },
    },
  })

  await prisma.feedEvent.createMany({
    data: postReactions.map(({ id, createdAt, post, author }) => ({
      createdAt,
      type: FeedEventType.POST_REACTION_CREATED,
      postReactionId: id,
      postId: post.id,
      tagId: post.tags[0].id,
      postReactionAuthorBirthdate: author.birthdate,
      postReactionAuthorSchoolId: author.schoolId,
    })),
  })

  console.log({ postReactions: postReactions.length })

  const posts = await prisma.post.findMany({
    where: {
      createdAt: {
        gt: sub(new Date(), { days: 1 }),
      },
      parentId: null,
    },
    include: {
      tags: true,
      author: true,
      parent: {
        include: {
          tags: true,
          author: true,
        },
      },
    },
  })

  await prisma.feedEvent.createMany({
    data: posts.map(({ id, author, createdAt, tags, parent }) => {
      return {
        createdAt,
        type: parent ? FeedEventType.POST_REPLY_CREATED : FeedEventType.POST_CREATED,
        postId: parent ? parent.id : id,
        tagId: parent ? parent.tags[0].id : tags[0].id,
        postAuthorBirthdate: parent ? parent?.author.birthdate : author.birthdate,
        postAuthorSchoolId: parent ? parent?.author.schoolId : author.schoolId,
      }
    }),
  })

  console.log({ posts: posts.length })
}

main()
