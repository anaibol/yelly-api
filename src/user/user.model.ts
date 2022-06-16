import { ID, Field, ObjectType } from '@nestjs/graphql'
import { PaginatedPosts } from 'src/post/paginated-posts.model'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import { School } from '../school/school.model'
import { FollowRequest } from './follow-request.model'
import { Training } from './training.model'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string
  createdAt?: Date | null
  firstName?: string | null
  lastName?: string | null
  birthdate?: Date | null
  pictureId?: string | null
  snapchat?: string | null
  instagram?: string | null
  about?: string | null
  locale?: string | null
  training?: Training | null
  school?: School | null
  posts?: PaginatedPosts
  isFollowedByAuthUser?: boolean
  pendingFollowRequestFromUser?: FollowRequest | null
  pendingFollowRequestToUser?: FollowRequest | null
  followers?: PaginatedUsers
  followees?: PaginatedUsers
  followersCount?: number
  followeesCount?: number
  postCount?: number
  viewsCount?: number
}
