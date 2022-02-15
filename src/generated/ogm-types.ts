import { SelectionSetNode, DocumentNode } from 'graphql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number
}

export type Query = {
  __typename?: 'Query'
  users: Array<User>
  usersCount: Scalars['Int']
  usersAggregate: UserAggregateSelection
}

export type QueryUsersArgs = {
  where?: Maybe<UserWhere>
  options?: Maybe<UserOptions>
}

export type QueryUsersCountArgs = {
  where?: Maybe<UserWhere>
}

export type QueryUsersAggregateArgs = {
  where?: Maybe<UserWhere>
}

export type Mutation = {
  __typename?: 'Mutation'
  createUsers: CreateUsersMutationResponse
  deleteUsers: DeleteInfo
  updateUsers: UpdateUsersMutationResponse
}

export type MutationCreateUsersArgs = {
  input: Array<UserCreateInput>
}

export type MutationDeleteUsersArgs = {
  where?: Maybe<UserWhere>
  delete?: Maybe<UserDeleteInput>
}

export type MutationUpdateUsersArgs = {
  where?: Maybe<UserWhere>
  update?: Maybe<UserUpdateInput>
  connect?: Maybe<UserConnectInput>
  disconnect?: Maybe<UserDisconnectInput>
  create?: Maybe<UserRelationInput>
  delete?: Maybe<UserDeleteInput>
}

export enum SortDirection {
  /** Sort by field values in ascending order. */
  Asc = 'ASC',
  /** Sort by field values in descending order. */
  Desc = 'DESC',
}

export type CreateInfo = {
  __typename?: 'CreateInfo'
  bookmark?: Maybe<Scalars['String']>
  nodesCreated: Scalars['Int']
  relationshipsCreated: Scalars['Int']
}

export type CreateUsersMutationResponse = {
  __typename?: 'CreateUsersMutationResponse'
  info: CreateInfo
  users: Array<User>
}

export type DeleteInfo = {
  __typename?: 'DeleteInfo'
  bookmark?: Maybe<Scalars['String']>
  nodesDeleted: Scalars['Int']
  relationshipsDeleted: Scalars['Int']
}

/** Pagination information (Relay) */
export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
  endCursor?: Maybe<Scalars['String']>
}

export type StringAggregateSelection = {
  __typename?: 'StringAggregateSelection'
  shortest?: Maybe<Scalars['String']>
  longest?: Maybe<Scalars['String']>
}

export type UpdateInfo = {
  __typename?: 'UpdateInfo'
  bookmark?: Maybe<Scalars['String']>
  nodesCreated: Scalars['Int']
  nodesDeleted: Scalars['Int']
  relationshipsCreated: Scalars['Int']
  relationshipsDeleted: Scalars['Int']
}

export type UpdateUsersMutationResponse = {
  __typename?: 'UpdateUsersMutationResponse'
  info: UpdateInfo
  users: Array<User>
}

export type User = {
  __typename?: 'User'
  id: Scalars['String']
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  pictureId?: Maybe<Scalars['String']>
  about?: Maybe<Scalars['String']>
  instagram?: Maybe<Scalars['String']>
  snapchat?: Maybe<Scalars['String']>
  friends?: Maybe<Array<Maybe<User>>>
  friendsAggregate?: Maybe<UserUserFriendsAggregationSelection>
  friendsConnection: UserFriendsConnection
}

export type UserFriendsArgs = {
  where?: Maybe<UserWhere>
  options?: Maybe<UserOptions>
}

export type UserFriendsAggregateArgs = {
  where?: Maybe<UserWhere>
}

export type UserFriendsConnectionArgs = {
  where?: Maybe<UserFriendsConnectionWhere>
  sort?: Maybe<Array<UserFriendsConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type UserAggregateSelection = {
  __typename?: 'UserAggregateSelection'
  count: Scalars['Int']
  id: StringAggregateSelection
  firstName: StringAggregateSelection
  lastName: StringAggregateSelection
  pictureId: StringAggregateSelection
  about: StringAggregateSelection
  instagram: StringAggregateSelection
  snapchat: StringAggregateSelection
}

export type UserFriendsConnection = {
  __typename?: 'UserFriendsConnection'
  edges: Array<UserFriendsRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type UserFriendsRelationship = {
  __typename?: 'UserFriendsRelationship'
  cursor: Scalars['String']
  node: User
}

export type UserUserFriendsAggregationSelection = {
  __typename?: 'UserUserFriendsAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<UserUserFriendsNodeAggregateSelection>
}

export type UserUserFriendsNodeAggregateSelection = {
  __typename?: 'UserUserFriendsNodeAggregateSelection'
  id: StringAggregateSelection
  firstName: StringAggregateSelection
  lastName: StringAggregateSelection
  pictureId: StringAggregateSelection
  about: StringAggregateSelection
  instagram: StringAggregateSelection
  snapchat: StringAggregateSelection
}

export type UserConnectInput = {
  friends?: Maybe<Array<UserFriendsConnectFieldInput>>
}

export type UserConnectWhere = {
  node: UserWhere
}

export type UserCreateInput = {
  id: Scalars['String']
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  pictureId?: Maybe<Scalars['String']>
  about?: Maybe<Scalars['String']>
  instagram?: Maybe<Scalars['String']>
  snapchat?: Maybe<Scalars['String']>
  friends?: Maybe<UserFriendsFieldInput>
}

export type UserDeleteInput = {
  friends?: Maybe<Array<UserFriendsDeleteFieldInput>>
}

export type UserDisconnectInput = {
  friends?: Maybe<Array<UserFriendsDisconnectFieldInput>>
}

export type UserFriendsAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<UserFriendsAggregateInput>>
  OR?: Maybe<Array<UserFriendsAggregateInput>>
  node?: Maybe<UserFriendsNodeAggregationWhereInput>
}

export type UserFriendsConnectFieldInput = {
  where?: Maybe<UserConnectWhere>
  connect?: Maybe<Array<UserConnectInput>>
}

export type UserFriendsConnectionSort = {
  node?: Maybe<UserSort>
}

export type UserFriendsConnectionWhere = {
  AND?: Maybe<Array<UserFriendsConnectionWhere>>
  OR?: Maybe<Array<UserFriendsConnectionWhere>>
  node?: Maybe<UserWhere>
  node_NOT?: Maybe<UserWhere>
}

export type UserFriendsCreateFieldInput = {
  node: UserCreateInput
}

export type UserFriendsDeleteFieldInput = {
  where?: Maybe<UserFriendsConnectionWhere>
  delete?: Maybe<UserDeleteInput>
}

export type UserFriendsDisconnectFieldInput = {
  where?: Maybe<UserFriendsConnectionWhere>
  disconnect?: Maybe<UserDisconnectInput>
}

export type UserFriendsFieldInput = {
  create?: Maybe<Array<UserFriendsCreateFieldInput>>
  connect?: Maybe<Array<UserFriendsConnectFieldInput>>
}

export type UserFriendsNodeAggregationWhereInput = {
  AND?: Maybe<Array<UserFriendsNodeAggregationWhereInput>>
  OR?: Maybe<Array<UserFriendsNodeAggregationWhereInput>>
  id_EQUAL?: Maybe<Scalars['String']>
  id_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  id_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  id_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  id_GT?: Maybe<Scalars['Int']>
  id_AVERAGE_GT?: Maybe<Scalars['Float']>
  id_LONGEST_GT?: Maybe<Scalars['Int']>
  id_SHORTEST_GT?: Maybe<Scalars['Int']>
  id_GTE?: Maybe<Scalars['Int']>
  id_AVERAGE_GTE?: Maybe<Scalars['Float']>
  id_LONGEST_GTE?: Maybe<Scalars['Int']>
  id_SHORTEST_GTE?: Maybe<Scalars['Int']>
  id_LT?: Maybe<Scalars['Int']>
  id_AVERAGE_LT?: Maybe<Scalars['Float']>
  id_LONGEST_LT?: Maybe<Scalars['Int']>
  id_SHORTEST_LT?: Maybe<Scalars['Int']>
  id_LTE?: Maybe<Scalars['Int']>
  id_AVERAGE_LTE?: Maybe<Scalars['Float']>
  id_LONGEST_LTE?: Maybe<Scalars['Int']>
  id_SHORTEST_LTE?: Maybe<Scalars['Int']>
  firstName_EQUAL?: Maybe<Scalars['String']>
  firstName_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  firstName_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  firstName_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  firstName_GT?: Maybe<Scalars['Int']>
  firstName_AVERAGE_GT?: Maybe<Scalars['Float']>
  firstName_LONGEST_GT?: Maybe<Scalars['Int']>
  firstName_SHORTEST_GT?: Maybe<Scalars['Int']>
  firstName_GTE?: Maybe<Scalars['Int']>
  firstName_AVERAGE_GTE?: Maybe<Scalars['Float']>
  firstName_LONGEST_GTE?: Maybe<Scalars['Int']>
  firstName_SHORTEST_GTE?: Maybe<Scalars['Int']>
  firstName_LT?: Maybe<Scalars['Int']>
  firstName_AVERAGE_LT?: Maybe<Scalars['Float']>
  firstName_LONGEST_LT?: Maybe<Scalars['Int']>
  firstName_SHORTEST_LT?: Maybe<Scalars['Int']>
  firstName_LTE?: Maybe<Scalars['Int']>
  firstName_AVERAGE_LTE?: Maybe<Scalars['Float']>
  firstName_LONGEST_LTE?: Maybe<Scalars['Int']>
  firstName_SHORTEST_LTE?: Maybe<Scalars['Int']>
  lastName_EQUAL?: Maybe<Scalars['String']>
  lastName_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lastName_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  lastName_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  lastName_GT?: Maybe<Scalars['Int']>
  lastName_AVERAGE_GT?: Maybe<Scalars['Float']>
  lastName_LONGEST_GT?: Maybe<Scalars['Int']>
  lastName_SHORTEST_GT?: Maybe<Scalars['Int']>
  lastName_GTE?: Maybe<Scalars['Int']>
  lastName_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lastName_LONGEST_GTE?: Maybe<Scalars['Int']>
  lastName_SHORTEST_GTE?: Maybe<Scalars['Int']>
  lastName_LT?: Maybe<Scalars['Int']>
  lastName_AVERAGE_LT?: Maybe<Scalars['Float']>
  lastName_LONGEST_LT?: Maybe<Scalars['Int']>
  lastName_SHORTEST_LT?: Maybe<Scalars['Int']>
  lastName_LTE?: Maybe<Scalars['Int']>
  lastName_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lastName_LONGEST_LTE?: Maybe<Scalars['Int']>
  lastName_SHORTEST_LTE?: Maybe<Scalars['Int']>
  pictureId_EQUAL?: Maybe<Scalars['String']>
  pictureId_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  pictureId_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  pictureId_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  pictureId_GT?: Maybe<Scalars['Int']>
  pictureId_AVERAGE_GT?: Maybe<Scalars['Float']>
  pictureId_LONGEST_GT?: Maybe<Scalars['Int']>
  pictureId_SHORTEST_GT?: Maybe<Scalars['Int']>
  pictureId_GTE?: Maybe<Scalars['Int']>
  pictureId_AVERAGE_GTE?: Maybe<Scalars['Float']>
  pictureId_LONGEST_GTE?: Maybe<Scalars['Int']>
  pictureId_SHORTEST_GTE?: Maybe<Scalars['Int']>
  pictureId_LT?: Maybe<Scalars['Int']>
  pictureId_AVERAGE_LT?: Maybe<Scalars['Float']>
  pictureId_LONGEST_LT?: Maybe<Scalars['Int']>
  pictureId_SHORTEST_LT?: Maybe<Scalars['Int']>
  pictureId_LTE?: Maybe<Scalars['Int']>
  pictureId_AVERAGE_LTE?: Maybe<Scalars['Float']>
  pictureId_LONGEST_LTE?: Maybe<Scalars['Int']>
  pictureId_SHORTEST_LTE?: Maybe<Scalars['Int']>
  about_EQUAL?: Maybe<Scalars['String']>
  about_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  about_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  about_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  about_GT?: Maybe<Scalars['Int']>
  about_AVERAGE_GT?: Maybe<Scalars['Float']>
  about_LONGEST_GT?: Maybe<Scalars['Int']>
  about_SHORTEST_GT?: Maybe<Scalars['Int']>
  about_GTE?: Maybe<Scalars['Int']>
  about_AVERAGE_GTE?: Maybe<Scalars['Float']>
  about_LONGEST_GTE?: Maybe<Scalars['Int']>
  about_SHORTEST_GTE?: Maybe<Scalars['Int']>
  about_LT?: Maybe<Scalars['Int']>
  about_AVERAGE_LT?: Maybe<Scalars['Float']>
  about_LONGEST_LT?: Maybe<Scalars['Int']>
  about_SHORTEST_LT?: Maybe<Scalars['Int']>
  about_LTE?: Maybe<Scalars['Int']>
  about_AVERAGE_LTE?: Maybe<Scalars['Float']>
  about_LONGEST_LTE?: Maybe<Scalars['Int']>
  about_SHORTEST_LTE?: Maybe<Scalars['Int']>
  instagram_EQUAL?: Maybe<Scalars['String']>
  instagram_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  instagram_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  instagram_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  instagram_GT?: Maybe<Scalars['Int']>
  instagram_AVERAGE_GT?: Maybe<Scalars['Float']>
  instagram_LONGEST_GT?: Maybe<Scalars['Int']>
  instagram_SHORTEST_GT?: Maybe<Scalars['Int']>
  instagram_GTE?: Maybe<Scalars['Int']>
  instagram_AVERAGE_GTE?: Maybe<Scalars['Float']>
  instagram_LONGEST_GTE?: Maybe<Scalars['Int']>
  instagram_SHORTEST_GTE?: Maybe<Scalars['Int']>
  instagram_LT?: Maybe<Scalars['Int']>
  instagram_AVERAGE_LT?: Maybe<Scalars['Float']>
  instagram_LONGEST_LT?: Maybe<Scalars['Int']>
  instagram_SHORTEST_LT?: Maybe<Scalars['Int']>
  instagram_LTE?: Maybe<Scalars['Int']>
  instagram_AVERAGE_LTE?: Maybe<Scalars['Float']>
  instagram_LONGEST_LTE?: Maybe<Scalars['Int']>
  instagram_SHORTEST_LTE?: Maybe<Scalars['Int']>
  snapchat_EQUAL?: Maybe<Scalars['String']>
  snapchat_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  snapchat_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  snapchat_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  snapchat_GT?: Maybe<Scalars['Int']>
  snapchat_AVERAGE_GT?: Maybe<Scalars['Float']>
  snapchat_LONGEST_GT?: Maybe<Scalars['Int']>
  snapchat_SHORTEST_GT?: Maybe<Scalars['Int']>
  snapchat_GTE?: Maybe<Scalars['Int']>
  snapchat_AVERAGE_GTE?: Maybe<Scalars['Float']>
  snapchat_LONGEST_GTE?: Maybe<Scalars['Int']>
  snapchat_SHORTEST_GTE?: Maybe<Scalars['Int']>
  snapchat_LT?: Maybe<Scalars['Int']>
  snapchat_AVERAGE_LT?: Maybe<Scalars['Float']>
  snapchat_LONGEST_LT?: Maybe<Scalars['Int']>
  snapchat_SHORTEST_LT?: Maybe<Scalars['Int']>
  snapchat_LTE?: Maybe<Scalars['Int']>
  snapchat_AVERAGE_LTE?: Maybe<Scalars['Float']>
  snapchat_LONGEST_LTE?: Maybe<Scalars['Int']>
  snapchat_SHORTEST_LTE?: Maybe<Scalars['Int']>
}

export type UserFriendsUpdateConnectionInput = {
  node?: Maybe<UserUpdateInput>
}

export type UserFriendsUpdateFieldInput = {
  where?: Maybe<UserFriendsConnectionWhere>
  update?: Maybe<UserFriendsUpdateConnectionInput>
  connect?: Maybe<Array<UserFriendsConnectFieldInput>>
  disconnect?: Maybe<Array<UserFriendsDisconnectFieldInput>>
  create?: Maybe<Array<UserFriendsCreateFieldInput>>
  delete?: Maybe<Array<UserFriendsDeleteFieldInput>>
}

export type UserOptions = {
  /** Specify one or more UserSort objects to sort Users by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: Maybe<Array<Maybe<UserSort>>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
}

export type UserRelationInput = {
  friends?: Maybe<Array<UserFriendsCreateFieldInput>>
}

/** Fields to sort Users by. The order in which sorts are applied is not guaranteed when specifying many fields in one UserSort object. */
export type UserSort = {
  id?: Maybe<SortDirection>
  firstName?: Maybe<SortDirection>
  lastName?: Maybe<SortDirection>
  pictureId?: Maybe<SortDirection>
  about?: Maybe<SortDirection>
  instagram?: Maybe<SortDirection>
  snapchat?: Maybe<SortDirection>
}

export type UserUpdateInput = {
  id?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  pictureId?: Maybe<Scalars['String']>
  about?: Maybe<Scalars['String']>
  instagram?: Maybe<Scalars['String']>
  snapchat?: Maybe<Scalars['String']>
  friends?: Maybe<Array<UserFriendsUpdateFieldInput>>
}

export type UserWhere = {
  OR?: Maybe<Array<UserWhere>>
  AND?: Maybe<Array<UserWhere>>
  id?: Maybe<Scalars['String']>
  id_NOT?: Maybe<Scalars['String']>
  id_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  id_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  id_CONTAINS?: Maybe<Scalars['String']>
  id_NOT_CONTAINS?: Maybe<Scalars['String']>
  id_STARTS_WITH?: Maybe<Scalars['String']>
  id_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  id_ENDS_WITH?: Maybe<Scalars['String']>
  id_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  firstName_NOT?: Maybe<Scalars['String']>
  firstName_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  firstName_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  firstName_CONTAINS?: Maybe<Scalars['String']>
  firstName_NOT_CONTAINS?: Maybe<Scalars['String']>
  firstName_STARTS_WITH?: Maybe<Scalars['String']>
  firstName_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  firstName_ENDS_WITH?: Maybe<Scalars['String']>
  firstName_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  lastName_NOT?: Maybe<Scalars['String']>
  lastName_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  lastName_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  lastName_CONTAINS?: Maybe<Scalars['String']>
  lastName_NOT_CONTAINS?: Maybe<Scalars['String']>
  lastName_STARTS_WITH?: Maybe<Scalars['String']>
  lastName_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  lastName_ENDS_WITH?: Maybe<Scalars['String']>
  lastName_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  pictureId?: Maybe<Scalars['String']>
  pictureId_NOT?: Maybe<Scalars['String']>
  pictureId_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  pictureId_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  pictureId_CONTAINS?: Maybe<Scalars['String']>
  pictureId_NOT_CONTAINS?: Maybe<Scalars['String']>
  pictureId_STARTS_WITH?: Maybe<Scalars['String']>
  pictureId_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  pictureId_ENDS_WITH?: Maybe<Scalars['String']>
  pictureId_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  about?: Maybe<Scalars['String']>
  about_NOT?: Maybe<Scalars['String']>
  about_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  about_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  about_CONTAINS?: Maybe<Scalars['String']>
  about_NOT_CONTAINS?: Maybe<Scalars['String']>
  about_STARTS_WITH?: Maybe<Scalars['String']>
  about_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  about_ENDS_WITH?: Maybe<Scalars['String']>
  about_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  instagram?: Maybe<Scalars['String']>
  instagram_NOT?: Maybe<Scalars['String']>
  instagram_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  instagram_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  instagram_CONTAINS?: Maybe<Scalars['String']>
  instagram_NOT_CONTAINS?: Maybe<Scalars['String']>
  instagram_STARTS_WITH?: Maybe<Scalars['String']>
  instagram_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  instagram_ENDS_WITH?: Maybe<Scalars['String']>
  instagram_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  snapchat?: Maybe<Scalars['String']>
  snapchat_NOT?: Maybe<Scalars['String']>
  snapchat_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  snapchat_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  snapchat_CONTAINS?: Maybe<Scalars['String']>
  snapchat_NOT_CONTAINS?: Maybe<Scalars['String']>
  snapchat_STARTS_WITH?: Maybe<Scalars['String']>
  snapchat_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  snapchat_ENDS_WITH?: Maybe<Scalars['String']>
  snapchat_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  friends?: Maybe<UserWhere>
  friends_NOT?: Maybe<UserWhere>
  friendsAggregate?: Maybe<UserFriendsAggregateInput>
  friendsConnection?: Maybe<UserFriendsConnectionWhere>
  friendsConnection_NOT?: Maybe<UserFriendsConnectionWhere>
}

export interface StringAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface UserAggregateInput {
  count?: boolean
  id?: StringAggregateInput
  firstName?: StringAggregateInput
  lastName?: StringAggregateInput
  pictureId?: StringAggregateInput
  about?: StringAggregateInput
  instagram?: StringAggregateInput
  snapchat?: StringAggregateInput
}

export declare class UserModel {
  public find(args?: {
    where?: UserWhere

    options?: UserOptions
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<User[]>
  public count(args?: { where?: UserWhere }): Promise<number>
  public create(args: {
    input: UserCreateInput[]
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<CreateUsersMutationResponse>
  public update(args: {
    where?: UserWhere
    update?: UserUpdateInput
    connect?: UserConnectInput
    disconnect?: UserDisconnectInput
    create?: UserCreateInput

    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<UpdateUsersMutationResponse>
  public delete(args: {
    where?: UserWhere
    delete?: UserDeleteInput
    context?: any
    rootValue: any
  }): Promise<{ nodesDeleted: number; relationshipsDeleted: number }>
  public aggregate(args: {
    where?: UserWhere

    aggregate: UserAggregateInput
    context?: any
    rootValue?: any
  }): Promise<UserAggregateSelection>
}

export interface ModelMap {
  User: UserModel
}
