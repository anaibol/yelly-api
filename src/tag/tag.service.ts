import { Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { TagArgs } from './tag.args'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { PushNotificationService } from '../core/push-notification.service'
import { PaginatedTrends } from './paginated-trends.model'
import { AuthUser } from 'src/auth/auth.service'
import { Tag } from './tag.model'
import { tagSelect } from './tag-select.constant'
import { excludedTags } from './excluded-tags.constant'
import { Prisma } from '@prisma/client'
import dates from 'src/utils/dates'

@Injectable()
export class TagService {
  constructor(
    private prismaService: PrismaService,
    private algoliaService: AlgoliaService,
    private pushNotificationService: PushNotificationService
  ) {}
  async syncTagIndexWithAlgolia(tagText: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')

    const tag = await this.prismaService.tag.findUnique({
      select: tagSelect,
      where: {
        text: tagText,
      },
    })

    if (!tag) return Promise.reject(new Error('Tag not found'))

    const objectToUpdateOrCreate: TagIndexAlgoliaInterface = {
      id: tag.id,
      text: tagText,
      postCount: {
        _operation: 'Increment',
        value: 1,
      },
      createdAtTimestamp: tag.createdAt.getTime(),
      createdAt: tag.createdAt,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, tag.id)
  }

  async getLiveTags(authUser: AuthUser): Promise<Tag[]> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const country = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!country) return Promise.reject(new Error('No country'))

    const liveTags = await this.prismaService.tag.findMany({
      where: {
        isLive: true,
        countryId: country.id,
      },
      select: tagSelect,
    })

    return liveTags.map(({ _count, ...tag }) => ({
      ...tag,
      postCount: _count.posts,
    }))
  }

  async createOrUpdateLiveTag(text: string, isLive: boolean, authUser: AuthUser): Promise<Tag> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const authUserCountry = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    // Get tag from text
    const tag = await this.prismaService.tag.findUnique({
      where: {
        text,
      },
    })

    const newTag = tag
      ? // If tag exists update isLive
        await this.prismaService.tag.update({
          where: {
            id: tag.id,
          },
          data: {
            isLive,
            countryId: authUserCountry?.id,
          },
        })
      : // Else create it with isLive: true
        await this.prismaService.tag.create({
          data: {
            text,
            isLive,
            countryId: authUserCountry?.id,
          },
        })

    // Delete all tags without posts and isLive: false
    await this.prismaService.tag.deleteMany({
      where: {
        isLive: false,
        posts: {
          every: {
            id: {
              in: [],
            },
          },
        },
      },
    })

    if (isLive) this.pushNotificationService.newLiveTag(newTag.id)

    return newTag
  }

  async findByText(tagArgs: TagArgs) {
    return this.prismaService.tag.findUnique({
      where: {
        text: tagArgs.text,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        isLive: true,
        isEmoji: true,
      },
    })
  }

  async delete(id: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')
    this.algoliaService.deleteObject(algoliaTagIndex, id)
    return true
  }

  async getTrends(authUser: AuthUser, isEmoji: boolean, skip: number, limit: number): Promise<PaginatedTrends> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const country = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!country) return Promise.reject(new Error('No country'))

    const [totalCount, tags] = await Promise.all([
      this.prismaService.tag.count({
        where: {
          isLive: false,
          countryId: country.id,
          text: {
            notIn: excludedTags,
            mode: 'insensitive',
          },
        },
      }),
      this.prismaService.tag.findMany({
        where: {
          isLive: false,
          countryId: country.id,
          isEmoji,
          text: {
            notIn: excludedTags,
            mode: 'insensitive',
          },
        },
        skip,
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
        take: limit,
        select: tagSelect,
      }),
    ])

    const nextSkip = skip + limit

    const dataTags = tags.map((tag) => {
      return {
        ...tag,
        postCount: tag._count.posts,
      }
    })

    return { items: dataTags, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  }

  async getTopTrends({
    authUser,
    skip,
    limit,
    isEmoji,
    postsAfter,
    postsBefore,
    postsAuthorBirthYear,
  }: {
    authUser: AuthUser
    skip: number
    limit: number
    isEmoji?: boolean
    postsAfter?: Date
    postsBefore?: Date
    postsAuthorBirthYear?: number
  }): Promise<PaginatedTrends> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const country = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!country) return Promise.reject(new Error('No country'))
    if (!authUser.birthdate) return Promise.reject(new Error('No birthdate'))

    const andIsEmoji = Prisma.sql`AND T."isEmoji" = ${isEmoji}`
    const andCreatedBetween = Prisma.sql`AND P."createdAt" > ${postsAfter} AND P."createdAt" < ${postsBefore}`
    const andPostsAuthorBirthdate = Prisma.sql`AND U."birthdate" > make_date(${postsAuthorBirthYear}, 01, 01) AND U."birthdate" < make_date(${postsAuthorBirthYear}, 12, 31)`

    const userAge = dates.getAge(authUser.birthdate)
    const datesRanges = dates.getDateRanges(userAge)

    const andPostsAuthorBirthdateRanges = Prisma.sql`AND U."birthdate" > ${datesRanges?.gte} AND U."birthdate" < ${datesRanges?.lt}`

    console.log({ andPostsAuthorBirthdate, andPostsAuthorBirthdateRanges })

    const query = Prisma.sql`
      SELECT
      T."id",
      T."text",
      T."isLive",
      COUNT(*) as "postCount"
      FROM
        "Tag" T,
        "_PostToTag" PT,
        "Post" P,
        "User" U
      WHERE
        PT. "B" = T. "id"
        AND PT. "A" = P. "id"
        AND U. "id" = P. "authorId"
        AND T."countryId" = ${country.id}
        ${postsAuthorBirthYear ? andPostsAuthorBirthdate : andPostsAuthorBirthdateRanges}
        ${isEmoji !== undefined ? andIsEmoji : Prisma.empty}
        ${postsAfter && postsBefore ? andCreatedBetween : Prisma.empty}
        AND LOWER(T."text") NOT IN (${Prisma.join(excludedTags)})
      GROUP BY T."id",T."text"	
      ORDER BY "postCount" desc
      OFFSET ${skip}
      LIMIT ${limit}
    `

    const tagTrends: { id: string; text: string; postCount: number; totalCount: number }[] =
      await this.prismaService.$queryRaw(query)

    const nextSkip = skip + limit
    const totalCount = tagTrends.length > 0 ? tagTrends[0].totalCount : 0

    return { items: tagTrends, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  }
}
