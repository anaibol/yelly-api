import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'
import { School } from './school.model'
import { SchoolService } from './school.service'
import { PostsArgs } from '../post/posts.args'
import { SchoolArgs } from './school.args'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelect } from '../post/post-select.constant'

@Resolver(School)
export class SchoolResolver {
  constructor(private schoolService: SchoolService, private prismaService: PrismaService) {}

  @Query(() => School, { nullable: true })
  async school(@Args() SchoolArgs?: SchoolArgs) {
    const { id, googlePlaceId } = SchoolArgs

    return this.schoolService.getSchool(id, googlePlaceId)
  }

  @ResolveField()
  async posts(@Parent() school: School, @Args() postsArgs: PostsArgs) {
    const { after, limit } = postsArgs

    const items = await this.prismaService.school.findUnique({ where: { id: school.id } }).posts({
      ...(after && {
        cursor: {
          createdAt: new Date(+after).toISOString(),
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: PostSelect,
    })

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
