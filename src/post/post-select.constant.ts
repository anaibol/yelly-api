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

export const PostSelectT = {
  select: {
    ...PostSelect,
    pollOptions: {
      select: {
        id: true,
        text: true,
        _count: true,
      },
    },
  },
}

export const PostSelectWithParentT = {
  select: {
    ...PostSelectT.select,
    parent: {
      select: {
        ...PostSelectWithParent.parent.select,
        pollOptions: {
          select: {
            id: true,
            text: true,
            _count: true,
          },
        },
      },
    },
  },
}

export function mapPosts(posts: Prisma.PostGetPayload<typeof PostSelectWithParentT>[]): Post[] {
  return posts.map(({ pollOptions, parent, _count, ...post }) => ({
    ...post,
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
      },
    }),
    childrenCount: _count.children,
    ...(pollOptions.length > 0 && {
      pollOptions: pollOptions.map((o) => ({
        id: o.id,
        text: o.text,
        votesCount: o._count.votes,
      })),
    }),
  }))
}
