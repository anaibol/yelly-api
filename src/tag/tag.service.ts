import { Injectable } from '@nestjs/common'
import { Prisma, TagType } from '@prisma/client'
import { customAlphabet } from 'nanoid'

import { SortDirection } from '../app.module'
import { AuthUser } from '../auth/auth.service'
import { AlgoliaService } from '../core/algolia.service'
import { BodyguardService } from '../core/bodyguard.service'
import { PrismaService } from '../core/prisma.service'
import { PushNotificationService } from '../core/push-notification.service'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { User } from '../user/user.model'
import { UserService } from '../user/user.service'
import { Tag } from './tag.model'
import { tagSelect } from './tag-select.constant'
import { TagSortBy } from './tags.args'
import { UpdateTagInput } from './update-tag.input'

const createNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8)

const getTagsSort = (
  sortBy?: TagSortBy,
  sortDirection?: SortDirection
): Prisma.Enumerable<Prisma.TagOrderByWithRelationInput> => {
  switch (sortBy) {
    case 'postCount':
      return [
        {
          posts: {
            _count: sortDirection,
          },
        },
        {
          createdAt: 'desc' as const,
        },
      ]

    case 'score':
      return [
        {
          score: sortDirection,
        },
        {
          createdAt: 'desc' as const,
        },
      ]

    default:
      return {
        createdAt: sortDirection,
      }
  }
}

@Injectable()
export class TagService {
  constructor(
    private prismaService: PrismaService,
    private algoliaService: AlgoliaService,
    private pushNotificationService: PushNotificationService,
    private bodyguardService: BodyguardService,
    private userService: UserService
  ) {}
  async syncTagIndexWithAlgolia(tagId: bigint) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')

    const tag = await this.prismaService.tag.findUnique({
      select: tagSelect,
      where: {
        id: tagId,
      },
    })

    if (!tag) return Promise.reject(new Error('Tag not found'))

    const objectToUpdateOrCreate: TagIndexAlgoliaInterface = {
      id: tag.id,
      text: tag.text,
      postCount: {
        _operation: 'Increment',
        value: 1,
      },
      createdAtTimestamp: tag.createdAt.getTime(),
      createdAt: tag.createdAt,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, tag.id.toString())
  }

  async getTag(tagId: bigint, authUser: AuthUser): Promise<Tag> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      select: authUser.isAdmin ? tagSelect : { ...tagSelect, scoreFactor: false },
    })

    if (!result) return Promise.reject(new Error('No tag'))

    const { _count, ...tag } = result

    return { ...tag, postCount: _count.posts, membersCount: _count.members }
  }

  async getTagByNanoId(nanoId: string, authUser: AuthUser): Promise<Tag> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        nanoId,
      },
      select: authUser.isAdmin ? tagSelect : { ...tagSelect, scoreFactor: false },
    })

    if (!result) return Promise.reject(new Error('No tag'))

    const { _count, ...tag } = result

    return { ...tag, postCount: _count.posts, membersCount: _count.members }
  }

  async create(tagText: string, authUser: AuthUser, tagType?: TagType, isPublic = false): Promise<Tag> {
    const expiresAt = new Date(new Date(Date.now()).getTime() + 60 * 60 * 24 * 1000)

    const tag = await this.prismaService.tag.create({
      data: {
        nanoId: createNanoId(),
        text: tagText,
        type: tagType,
        isPublic,
        authorId: authUser.id,
        expiresAt,
      },
    })

    this.bodyguardService.analyseTopic(tag, authUser)

    this.syncTagIndexWithAlgolia(tag.id)

    if (isPublic) this.pushNotificationService.followeeCreatedTag(tag.id)

    return tag
  }

  async joinTag(nanoId: string, authUser: AuthUser): Promise<Tag> {
    return this.prismaService.tag.update({
      select: tagSelect,
      where: {
        nanoId,
      },
      data: {
        members: {
          connect: {
            id: authUser.id,
          },
        },
      },
    })
  }

  async unJoinTag(nanoId: string, authUser: AuthUser): Promise<Tag> {
    return this.prismaService.tag.update({
      select: tagSelect,
      where: {
        nanoId,
      },
      data: {
        members: {
          disconnect: {
            id: authUser.id,
          },
        },
      },
    })
  }

  async delete(tagId: bigint): Promise<boolean> {
    await this.prismaService.tag.delete({
      where: { id: tagId },
    })

    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')
    this.algoliaService.deleteObject(algoliaTagIndex, tagId.toString())

    return true
  }

  async getTags(
    authUser: User | AuthUser,
    shouldIncludeExpired: boolean,
    isForYou: boolean,
    showScoreFactor: boolean,
    limit: number,
    after?: bigint,
    sortBy?: TagSortBy,
    sortDirection?: SortDirection,
    showHidden?: boolean,
    authorId?: string
  ) {
    const isAuthUserType = (authUser as AuthUser).isAdmin !== undefined
    const isAdmin = isAuthUserType && (authUser as AuthUser).isAdmin

    if (showHidden && !isAdmin) {
      return Promise.reject(new Error('No admin'))
    }

    const where: Prisma.TagWhereInput = {
      ...(authorId
        ? {
            authorId,
          }
        : null),
      ...(shouldIncludeExpired
        ? null
        : {
            expiresAt: {
              gt: new Date(Date.now()),
            },
          }),
      ...(!showHidden && {
        isHidden: false,
      }),
      author: {
        isBanned: false,
        blockedUsers: {
          none: {
            id: authUser.id,
          },
        },
        blockedByUsers: {
          none: {
            id: authUser.id,
          },
        },
      },
      ...(isForYou && {
        author: {
          id: {
            not: authUser.id,
          },
        },
        OR: [
          {
            isPublic: true,
            author: {
              followers: {
                some: {
                  userId: authUser.id,
                },
              },
            },
          },
          {
            members: {
              some: {
                id: authUser.id,
              },
            },
          },
        ],
      }),
    }

    const [totalCount, tags] = await Promise.all([
      this.prismaService.tag.count({
        where,
      }),
      this.prismaService.tag.findMany({
        where,
        ...(after && {
          cursor: {
            id: after,
          },
          skip: 1,
        }),
        orderBy: getTagsSort(sortBy, sortDirection),
        take: limit,
        select: showScoreFactor ? tagSelect : { ...tagSelect, score: false, scoreFactor: false },
      }),
    ])

    const items = tags.map((tag) => {
      return {
        ...tag,
        postCount: tag._count.posts,
        membersCount: tag._count.members,
      }
    })

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor, totalCount }
  }

  async updateTag(tagId: bigint, { isHidden, scoreFactor }: UpdateTagInput): Promise<Tag> {
    return this.prismaService.tag.update({
      where: {
        id: tagId,
      },
      data: {
        isHidden,
        scoreFactor,
      },
    })
  }

  async trackTagViews(tagsIds: bigint[]): Promise<boolean> {
    const tags = await this.prismaService.tag.findMany({
      where: {
        id: { in: tagsIds },
      },
      select: {
        id: true,
        viewsCount: true,
        interactionsCount: true,
        scoreFactor: true,
      },
    })

    const promises: Promise<any>[] = []

    tags.forEach((tag) =>
      // eslint-disable-next-line functional/immutable-data
      promises.push(
        this.prismaService.tag.update({
          where: { id: tag.id },
          data: {
            viewsCount: { increment: 1 },
            score: this.getTagScore({ ...tag, viewsCount: tag.viewsCount + 1 }),
          },
        })
      )
    )

    await Promise.all(promises)

    return true
  }

  async trackTagShare(tagId: bigint): Promise<boolean> {
    await this.prismaService.tag.update({
      where: { id: tagId },
      data: {
        shareCount: { increment: 1 },
      },
    })

    return true
  }

  async updateInteractionsCount(tagId: bigint, isIncrement = true): Promise<boolean> {
    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      select: {
        viewsCount: true,
        interactionsCount: true,
        scoreFactor: true,
      },
    })

    if (!tag) return Promise.reject(new Error('No tag'))

    // TODO: Use a single transaction for both read and update counters
    await this.prismaService.tag.update({
      where: { id: tagId },
      data: {
        interactionsCount: isIncrement ? { increment: 1 } : { decrement: 1 },
        score: this.getTagScore({ ...tag, interactionsCount: tag.interactionsCount + (isIncrement ? 1 : -1) }),
      },
    })

    return true
  }

  getTagScore({
    viewsCount,
    interactionsCount,
    scoreFactor,
  }: {
    viewsCount?: number
    interactionsCount: number
    scoreFactor: number | null
  }) {
    if (!viewsCount || viewsCount === 0 || !interactionsCount || interactionsCount === 0) return 0
    return (interactionsCount / viewsCount) * (scoreFactor ?? 1)
  }
}
