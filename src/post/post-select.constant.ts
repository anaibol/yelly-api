import { Prisma } from '@prisma/client'
import { Post } from './post.model'

// Prisma.PostSelect
export const PostSelect = {
  id: true,
  parentId: true,
  createdAt: true,
  expiresAt: true,
  expiresIn: true,
  viewsCount: true,
  text: true,
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
    },
  },
  _count: {
    select: {
      children: true,
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

export const PostChildSelect = {
  select: {
    ...PostSelect,
    _count: {
      select: {
        children: true,
      },
    },
  },
}

export function mapPost(post: Prisma.PostGetPayload<typeof PostSelectWithParentT>): Post {
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
  }
}

export function mapPostChild(
  child: Prisma.PostGetPayload<typeof PostChildSelect>,
  parent: Prisma.PostGetPayload<typeof PostSelectWithParentT>
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
    expiresIn: parent.expiresIn,
    expiresAt: parent.expiresAt,
  }
}

export const notExpiredCondition = {
  OR: [
    {
      expiresAt: {
        gte: new Date(), // Get UTC date from new Date() and convert to ISO
      },
    },
    {
      expiresAt: null,
    },
  ],
}
