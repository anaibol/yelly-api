import { Prisma } from '@prisma/client'

import { Post } from './post.model'

export const PostSelect = {
  id: true,
  parentId: true,
  createdAt: true,
  viewsCount: true,
  text: true,
  charsCount: true,
  wordsCount: true,
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
      position: 'asc' as const,
    },
  },
  author: {
    select: {
      id: true,
      createdAt: true,
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
    },
  },
  _count: {
    select: {
      children: true,
      reactions: true,
    },
  },
  userMentions: {
    select: {
      id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          birthdate: true,
          pictureId: true,
        },
      },
    },
  },
}

export const PostSelectWithParent = {
  ...PostSelect,
  parent: {
    select: PostSelect,
  },
}

export type PostWithParent = Prisma.PostGetPayload<{
  select: typeof PostSelectWithParent
}>

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

export function mapPost(post: PostWithParent): Post {
  const { userMentions, pollOptions, parent, _count, ...rest } = post

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
    ...(userMentions.length > 0 && {
      mentionedUsers: userMentions.map(({ user }) => user),
    }),
    childrenCount: _count.children,
    reactionsCount: _count.reactions,
  }
}

type PostChild = Prisma.PostGetPayload<typeof PostChildSelect>

export function mapPostChild(child: PostChild): Post {
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
  }
}
