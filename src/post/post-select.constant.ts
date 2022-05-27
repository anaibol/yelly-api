import { Prisma } from '@prisma/client'
import { Post } from './post.model'

export const PostSelect = {
  id: true,
  parentId: true,
  threadId: true,
  createdAt: true,
  expiresAt: true,
  expiresIn: true,
  viewsCount: true,
  text: true,
  charsCount: true,
  wordsCount: true,
  ranks: {
    select: {
      id: true,
      position: true,
      previousPosition: true,
      score: true,
      tag: {
        select: {
          id: true,
          createdAt: true,
          text: true,
          isLive: true,
          isEmoji: true,
        },
      },
    },
  },
  pollOptions: {
    select: {
      id: true,
      text: true,
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      position: 'asc' as Prisma.SortOrder,
    },
  },
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthdate: true,
      pictureId: true,
      school: {
        select: {
          id: true,
          name: true,
          lat: true,
          lng: true,
          city: {
            select: {
              id: true,
              name: true,
              country: {
                select: {
                  id: true,
                  code: true,
                },
              },
            },
          },
        },
      },
    },
  },
  tags: {
    select: {
      id: true,
      createdAt: true,
      text: true,
      isLive: true,
      isEmoji: true,
    },
  },
  _count: {
    select: {
      children: true,
      reactions: true,
    },
  },
}

export const PostSelectWithParent = {
  ...PostSelect,
  parent: {
    select: PostSelect,
  },
}

const PostSelectWithParentT = {
  select: PostSelectWithParent,
}

export type PostSelectWithParentTT = Prisma.PostGetPayload<typeof PostSelectWithParentT>

export const PostChildSelect = {
  select: {
    ...PostSelect,
    _count: {
      select: {
        children: true,
        reactions: true,
      },
    },
  },
}

export function mapPost(post: PostSelectWithParentTT): Post {
  const { pollOptions, parent, _count, ...rest } = post

  return {
    ...rest,
    ...(parent && {
      parent: {
        ...parent,
        pollOptions:
          parent.pollOptions.length > 0
            ? parent.pollOptions.map((o) => ({
                id: o.id,
                text: o.text,
                votesCount: o._count.votes,
              }))
            : undefined,
        childrenCount: parent._count.children,
        reactionsCount: parent._count.reactions,
      },
    }),
    ...(pollOptions.length > 0 && {
      pollOptions: pollOptions.map((o) => ({
        id: o.id,
        text: o.text,
        votesCount: o._count.votes,
      })),
    }),
    childrenCount: _count.children,
    reactionsCount: _count.reactions,
  }
}

export function mapPostChild(
  child: Prisma.PostGetPayload<typeof PostChildSelect>,
  parent: PostSelectWithParentTT
): Post {
  const { _count, pollOptions, ...rest } = child

  return {
    ...rest,
    ...(pollOptions.length > 0 && {
      pollOptions: pollOptions.map((o) => ({
        id: o.id,
        text: o.text,
        votesCount: o._count.votes,
      })),
    }),
    childrenCount: _count.children,
    reactionsCount: _count.children,
    expiresIn: parent.expiresIn,
    expiresAt: parent.expiresAt,
  }
}

export const getNotExpiredCondition = () => ({
  OR: [
    {
      expiresAt: {
        gte: new Date(),
      },
    },
    {
      expiresAt: null,
    },
  ],
})
