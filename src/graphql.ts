/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateCommentInput {
  postId: string
  text: string
}

export interface CreateLiveTagInput {
  text: string
}

export interface CreateOrUpdatePostReactionInput {
  postId: string
  reaction: string
}

export interface CreatePostInput {
  tag: string
  text: string
}

export interface DeletePostInput {
  id: string
}

export interface DeletePostReactionInput {
  postId: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  password: string
  resetToken: string
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignUpInput {
  email: string
  locale: string
  password: string
}

export interface ToggleFollowInput {
  otherUserId: string
  value: boolean
}

export interface UpdateUserInput {
  about?: Nullable<string>
  avatar3dId?: Nullable<string>
  birthdate?: Nullable<DateTime>
  email?: Nullable<string>
  firstName?: Nullable<string>
  instagram?: Nullable<string>
  isFilled?: Nullable<boolean>
  lastName?: Nullable<string>
  password?: Nullable<string>
  pictureId?: Nullable<string>
  schoolGooglePlaceId?: Nullable<string>
  snapchat?: Nullable<string>
  trainingName?: Nullable<string>
}

export interface City {
  country?: Nullable<Country>
  googlePlaceId?: Nullable<string>
  id: string
  lat?: Nullable<string>
  lng?: Nullable<string>
  name: string
}

export interface Country {
  id: string
  name: string
}

export interface LastUsers {
  firstName: string
  id: string
  pictureId?: Nullable<string>
}

export interface LiveTagAuthUser {
  authUserPosted: boolean
  id: string
  lastUsers?: Nullable<LastUsers[]>
  postCount: number
  text: string
}

export interface Me {
  about?: Nullable<string>
  avatar3dId?: Nullable<string>
  birthdate?: Nullable<DateTime>
  email?: Nullable<string>
  expoPushNotificationTokens?: Nullable<string[]>
  firstName?: Nullable<string>
  followees?: Nullable<User[]>
  followeesCount?: Nullable<number>
  followers?: Nullable<User[]>
  followersCount?: Nullable<number>
  id: string
  instagram?: Nullable<string>
  isFilled?: Nullable<boolean>
  lastName?: Nullable<string>
  locale?: Nullable<string>
  pictureId?: Nullable<string>
  posts?: Nullable<PaginatedPosts>
  school?: Nullable<School>
  sendbirdAccessToken?: Nullable<string>
  snapchat?: Nullable<string>
  training?: Nullable<Training>
}

export interface IMutation {
  addExpoPushNotificationsToken(input: string): boolean | Promise<boolean>
  createLiveTag(input: CreateLiveTagInput): Tag | Promise<Tag>
  createOrUpdatePostReaction(input: CreateOrUpdatePostReactionInput): boolean | Promise<boolean>
  createPost(input: CreatePostInput): Post | Promise<Post>
  createPostComment(input: CreateCommentInput): boolean | Promise<boolean>
  deleteAuthUser(): boolean | Promise<boolean>
  deleteExpoPushNotificationsToken(input: string): boolean | Promise<boolean>
  deletePost(input: DeletePostInput): boolean | Promise<boolean>
  deletePostReaction(input: DeletePostReactionInput): boolean | Promise<boolean>
  forgotPassword(input: ForgotPasswordInput): boolean | Promise<boolean>
  refreshSendbirdAccessToken(): SendbirdAccessToken | Promise<SendbirdAccessToken>
  resetPassword(input: ResetPasswordInput): Token | Promise<Token>
  signIn(input: SignInInput): Token | Promise<Token>
  signUp(input: SignUpInput): Token | Promise<Token>
  toggleFollowUser(input: ToggleFollowInput): boolean | Promise<boolean>
  trackPostViews(postsIds: string[]): boolean | Promise<boolean>
  updateIsSeenNotification(input: string): boolean | Promise<boolean>
  updateMe(input: UpdateUserInput): Me | Promise<Me>
}

export interface Notification {
  createdAt: DateTime
  follower?: Nullable<User>
  id: string
  isSeen?: Nullable<boolean>
  itemId?: Nullable<string>
  postReaction?: Nullable<PostReaction>
  type: string
  user: User
}

export interface PaginatedNotifications {
  items: Notification[]
  nextCursor: string
}

export interface PaginatedPosts {
  items: Post[]
  nextCursor: string
}

export interface Post {
  author: User
  comments?: Nullable<PostComment[]>
  createdAt: DateTime
  id: string
  reactions: PostReaction[]
  tags: Tag[]
  text: string
  totalCommentsCount?: Nullable<number>
  totalReactionsCount: number
  viewsCount: number
}

export interface PostComment {
  author: User
  authorId: string
  createdAt?: Nullable<DateTime>
  id: string
  text: string
}

export interface PostReaction {
  author?: Nullable<User>
  createdAt?: Nullable<DateTime>
  id: string
  postId?: Nullable<string>
  reaction: string
}

export interface IQuery {
  getS3PresignedUploadUrl(): Upload | Promise<Upload>
  liveTag(): Nullable<LiveTagAuthUser> | Promise<Nullable<LiveTagAuthUser>>
  me(): Me | Promise<Me>
  notifications(
    after?: Nullable<string>,
    limit?: Nullable<number>
  ): PaginatedNotifications | Promise<PaginatedNotifications>
  post(id: string): Post | Promise<Post>
  posts(
    after?: Nullable<string>,
    limit?: Nullable<number>,
    schoolId?: Nullable<string>,
    tag?: Nullable<string>,
    userId?: Nullable<string>
  ): PaginatedPosts | Promise<PaginatedPosts>
  school(googlePlaceId?: Nullable<string>, id?: Nullable<string>): Nullable<School> | Promise<Nullable<School>>
  tag(id?: Nullable<string>): Tag | Promise<Tag>
  unreadNotificationsCount(): number | Promise<number>
  user(id: string): User | Promise<User>
}

export interface School {
  city?: Nullable<City>
  googlePlaceId?: Nullable<string>
  id: string
  lat?: Nullable<string>
  lng?: Nullable<string>
  name?: Nullable<string>
  posts?: Nullable<PaginatedPosts>
  totalUsersCount?: Nullable<number>
  users?: Nullable<User[]>
}

export interface SendbirdAccessToken {
  sendbirdAccessToken: string
}

export interface Tag {
  author?: Nullable<User>
  createdAt?: Nullable<DateTime>
  id: string
  isLive: boolean
  posts?: Nullable<PaginatedPosts>
  text: string
}

export interface Token {
  accessToken: string
}

export interface Training {
  id: string
  name: string
}

export interface Upload {
  key: string
  url: string
}

export interface User {
  about?: Nullable<string>
  avatar3dId?: Nullable<string>
  birthdate?: Nullable<DateTime>
  firstName?: Nullable<string>
  followees?: Nullable<User[]>
  followeesCount?: Nullable<number>
  followers?: Nullable<User[]>
  followersCount?: Nullable<number>
  id: string
  instagram?: Nullable<string>
  isFollowingAuthUser?: Nullable<boolean>
  lastName?: Nullable<string>
  locale?: Nullable<string>
  pictureId?: Nullable<string>
  posts?: Nullable<PaginatedPosts>
  school?: Nullable<School>
  snapchat?: Nullable<string>
  training?: Nullable<Training>
}

export type DateTime = any
type Nullable<T> = T | null
