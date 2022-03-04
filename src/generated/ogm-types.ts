import { SelectionSetNode, DocumentNode } from 'graphql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  ID: string
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number
  /** A date and time, represented as an ISO-8601 string */
  DateTime: any
}

export type Query = {
  __typename?: 'Query'
  users: Array<User>
  usersCount: Scalars['Int']
  usersAggregate: UserAggregateSelection
  trainings: Array<Training>
  trainingsCount: Scalars['Int']
  trainingsAggregate: TrainingAggregateSelection
  countries: Array<Country>
  countriesCount: Scalars['Int']
  countriesAggregate: CountryAggregateSelection
  cities: Array<City>
  citiesCount: Scalars['Int']
  citiesAggregate: CityAggregateSelection
  schools: Array<School>
  schoolsCount: Scalars['Int']
  schoolsAggregate: SchoolAggregateSelection
  tags: Array<Tag>
  tagsCount: Scalars['Int']
  tagsAggregate: TagAggregateSelection
  posts: Array<Post>
  postsCount: Scalars['Int']
  postsAggregate: PostAggregateSelection
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

export type QueryTrainingsArgs = {
  where?: Maybe<TrainingWhere>
  options?: Maybe<TrainingOptions>
}

export type QueryTrainingsCountArgs = {
  where?: Maybe<TrainingWhere>
}

export type QueryTrainingsAggregateArgs = {
  where?: Maybe<TrainingWhere>
}

export type QueryCountriesArgs = {
  where?: Maybe<CountryWhere>
  options?: Maybe<CountryOptions>
}

export type QueryCountriesCountArgs = {
  where?: Maybe<CountryWhere>
}

export type QueryCountriesAggregateArgs = {
  where?: Maybe<CountryWhere>
}

export type QueryCitiesArgs = {
  where?: Maybe<CityWhere>
  options?: Maybe<CityOptions>
}

export type QueryCitiesCountArgs = {
  where?: Maybe<CityWhere>
}

export type QueryCitiesAggregateArgs = {
  where?: Maybe<CityWhere>
}

export type QuerySchoolsArgs = {
  where?: Maybe<SchoolWhere>
  options?: Maybe<SchoolOptions>
}

export type QuerySchoolsCountArgs = {
  where?: Maybe<SchoolWhere>
}

export type QuerySchoolsAggregateArgs = {
  where?: Maybe<SchoolWhere>
}

export type QueryTagsArgs = {
  where?: Maybe<TagWhere>
  options?: Maybe<TagOptions>
}

export type QueryTagsCountArgs = {
  where?: Maybe<TagWhere>
}

export type QueryTagsAggregateArgs = {
  where?: Maybe<TagWhere>
}

export type QueryPostsArgs = {
  where?: Maybe<PostWhere>
  options?: Maybe<PostOptions>
}

export type QueryPostsCountArgs = {
  where?: Maybe<PostWhere>
}

export type QueryPostsAggregateArgs = {
  where?: Maybe<PostWhere>
}

export type Mutation = {
  __typename?: 'Mutation'
  createUsers: CreateUsersMutationResponse
  deleteUsers: DeleteInfo
  updateUsers: UpdateUsersMutationResponse
  createTrainings: CreateTrainingsMutationResponse
  deleteTrainings: DeleteInfo
  updateTrainings: UpdateTrainingsMutationResponse
  createCountries: CreateCountriesMutationResponse
  deleteCountries: DeleteInfo
  updateCountries: UpdateCountriesMutationResponse
  createCities: CreateCitiesMutationResponse
  deleteCities: DeleteInfo
  updateCities: UpdateCitiesMutationResponse
  createSchools: CreateSchoolsMutationResponse
  deleteSchools: DeleteInfo
  updateSchools: UpdateSchoolsMutationResponse
  createTags: CreateTagsMutationResponse
  deleteTags: DeleteInfo
  updateTags: UpdateTagsMutationResponse
  createPosts: CreatePostsMutationResponse
  deletePosts: DeleteInfo
  updatePosts: UpdatePostsMutationResponse
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

export type MutationCreateTrainingsArgs = {
  input: Array<TrainingCreateInput>
}

export type MutationDeleteTrainingsArgs = {
  where?: Maybe<TrainingWhere>
  delete?: Maybe<TrainingDeleteInput>
}

export type MutationUpdateTrainingsArgs = {
  where?: Maybe<TrainingWhere>
  update?: Maybe<TrainingUpdateInput>
  connect?: Maybe<TrainingConnectInput>
  disconnect?: Maybe<TrainingDisconnectInput>
  create?: Maybe<TrainingRelationInput>
  delete?: Maybe<TrainingDeleteInput>
}

export type MutationCreateCountriesArgs = {
  input: Array<CountryCreateInput>
}

export type MutationDeleteCountriesArgs = {
  where?: Maybe<CountryWhere>
  delete?: Maybe<CountryDeleteInput>
}

export type MutationUpdateCountriesArgs = {
  where?: Maybe<CountryWhere>
  update?: Maybe<CountryUpdateInput>
  connect?: Maybe<CountryConnectInput>
  disconnect?: Maybe<CountryDisconnectInput>
  create?: Maybe<CountryRelationInput>
  delete?: Maybe<CountryDeleteInput>
}

export type MutationCreateCitiesArgs = {
  input: Array<CityCreateInput>
}

export type MutationDeleteCitiesArgs = {
  where?: Maybe<CityWhere>
  delete?: Maybe<CityDeleteInput>
}

export type MutationUpdateCitiesArgs = {
  where?: Maybe<CityWhere>
  update?: Maybe<CityUpdateInput>
  connect?: Maybe<CityConnectInput>
  disconnect?: Maybe<CityDisconnectInput>
  create?: Maybe<CityRelationInput>
  delete?: Maybe<CityDeleteInput>
}

export type MutationCreateSchoolsArgs = {
  input: Array<SchoolCreateInput>
}

export type MutationDeleteSchoolsArgs = {
  where?: Maybe<SchoolWhere>
  delete?: Maybe<SchoolDeleteInput>
}

export type MutationUpdateSchoolsArgs = {
  where?: Maybe<SchoolWhere>
  update?: Maybe<SchoolUpdateInput>
  connect?: Maybe<SchoolConnectInput>
  disconnect?: Maybe<SchoolDisconnectInput>
  create?: Maybe<SchoolRelationInput>
  delete?: Maybe<SchoolDeleteInput>
}

export type MutationCreateTagsArgs = {
  input: Array<TagCreateInput>
}

export type MutationDeleteTagsArgs = {
  where?: Maybe<TagWhere>
  delete?: Maybe<TagDeleteInput>
}

export type MutationUpdateTagsArgs = {
  where?: Maybe<TagWhere>
  update?: Maybe<TagUpdateInput>
  connect?: Maybe<TagConnectInput>
  disconnect?: Maybe<TagDisconnectInput>
  create?: Maybe<TagRelationInput>
  delete?: Maybe<TagDeleteInput>
}

export type MutationCreatePostsArgs = {
  input: Array<PostCreateInput>
}

export type MutationDeletePostsArgs = {
  where?: Maybe<PostWhere>
  delete?: Maybe<PostDeleteInput>
}

export type MutationUpdatePostsArgs = {
  where?: Maybe<PostWhere>
  update?: Maybe<PostUpdateInput>
  connect?: Maybe<PostConnectInput>
  disconnect?: Maybe<PostDisconnectInput>
  create?: Maybe<PostRelationInput>
  delete?: Maybe<PostDeleteInput>
}

export enum SortDirection {
  /** Sort by field values in ascending order. */
  Asc = 'ASC',
  /** Sort by field values in descending order. */
  Desc = 'DESC',
}

export type City = {
  __typename?: 'City'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  googlePlaceId?: Maybe<Scalars['String']>
  lat?: Maybe<Scalars['Float']>
  lng?: Maybe<Scalars['Float']>
  schools?: Maybe<Array<School>>
  schoolsAggregate?: Maybe<CitySchoolSchoolsAggregationSelection>
  country?: Maybe<Country>
  countryAggregate?: Maybe<CityCountryCountryAggregationSelection>
  schoolsConnection: CitySchoolsConnection
  countryConnection: CityCountryConnection
}

export type CitySchoolsArgs = {
  where?: Maybe<SchoolWhere>
  options?: Maybe<SchoolOptions>
}

export type CitySchoolsAggregateArgs = {
  where?: Maybe<SchoolWhere>
}

export type CityCountryArgs = {
  where?: Maybe<CountryWhere>
  options?: Maybe<CountryOptions>
}

export type CityCountryAggregateArgs = {
  where?: Maybe<CountryWhere>
}

export type CitySchoolsConnectionArgs = {
  where?: Maybe<CitySchoolsConnectionWhere>
  sort?: Maybe<Array<CitySchoolsConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type CityCountryConnectionArgs = {
  where?: Maybe<CityCountryConnectionWhere>
  sort?: Maybe<Array<CityCountryConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type CityAggregateSelection = {
  __typename?: 'CityAggregateSelection'
  count: Scalars['Int']
  id: IdAggregateSelection
  name: StringAggregateSelection
  googlePlaceId: StringAggregateSelection
  lat: FloatAggregateSelection
  lng: FloatAggregateSelection
}

export type CityCountryConnection = {
  __typename?: 'CityCountryConnection'
  edges: Array<CityCountryRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type CityCountryCountryAggregationSelection = {
  __typename?: 'CityCountryCountryAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<CityCountryCountryNodeAggregateSelection>
}

export type CityCountryCountryNodeAggregateSelection = {
  __typename?: 'CityCountryCountryNodeAggregateSelection'
  id: IdAggregateSelection
  name: StringAggregateSelection
}

export type CityCountryRelationship = {
  __typename?: 'CityCountryRelationship'
  cursor: Scalars['String']
  node: Country
}

export type CitySchoolSchoolsAggregationSelection = {
  __typename?: 'CitySchoolSchoolsAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<CitySchoolSchoolsNodeAggregateSelection>
}

export type CitySchoolSchoolsNodeAggregateSelection = {
  __typename?: 'CitySchoolSchoolsNodeAggregateSelection'
  googlePlaceId: StringAggregateSelection
  id: IdAggregateSelection
  lat: FloatAggregateSelection
  lng: FloatAggregateSelection
  name: StringAggregateSelection
}

export type CitySchoolsConnection = {
  __typename?: 'CitySchoolsConnection'
  edges: Array<CitySchoolsRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type CitySchoolsRelationship = {
  __typename?: 'CitySchoolsRelationship'
  cursor: Scalars['String']
  node: School
}

export type Country = {
  __typename?: 'Country'
  id: Scalars['ID']
  name: Scalars['String']
  cities?: Maybe<Array<City>>
  citiesAggregate?: Maybe<CountryCityCitiesAggregationSelection>
  citiesConnection: CountryCitiesConnection
}

export type CountryCitiesArgs = {
  where?: Maybe<CityWhere>
  options?: Maybe<CityOptions>
}

export type CountryCitiesAggregateArgs = {
  where?: Maybe<CityWhere>
}

export type CountryCitiesConnectionArgs = {
  where?: Maybe<CountryCitiesConnectionWhere>
  sort?: Maybe<Array<CountryCitiesConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type CountryAggregateSelection = {
  __typename?: 'CountryAggregateSelection'
  count: Scalars['Int']
  id: IdAggregateSelection
  name: StringAggregateSelection
}

export type CountryCitiesConnection = {
  __typename?: 'CountryCitiesConnection'
  edges: Array<CountryCitiesRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type CountryCitiesRelationship = {
  __typename?: 'CountryCitiesRelationship'
  cursor: Scalars['String']
  node: City
}

export type CountryCityCitiesAggregationSelection = {
  __typename?: 'CountryCityCitiesAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<CountryCityCitiesNodeAggregateSelection>
}

export type CountryCityCitiesNodeAggregateSelection = {
  __typename?: 'CountryCityCitiesNodeAggregateSelection'
  id: IdAggregateSelection
  name: StringAggregateSelection
  googlePlaceId: StringAggregateSelection
  lat: FloatAggregateSelection
  lng: FloatAggregateSelection
}

export type CreateCitiesMutationResponse = {
  __typename?: 'CreateCitiesMutationResponse'
  info: CreateInfo
  cities: Array<City>
}

export type CreateCountriesMutationResponse = {
  __typename?: 'CreateCountriesMutationResponse'
  info: CreateInfo
  countries: Array<Country>
}

export type CreateInfo = {
  __typename?: 'CreateInfo'
  bookmark?: Maybe<Scalars['String']>
  nodesCreated: Scalars['Int']
  relationshipsCreated: Scalars['Int']
}

export type CreatePostsMutationResponse = {
  __typename?: 'CreatePostsMutationResponse'
  info: CreateInfo
  posts: Array<Post>
}

export type CreateSchoolsMutationResponse = {
  __typename?: 'CreateSchoolsMutationResponse'
  info: CreateInfo
  schools: Array<School>
}

export type CreateTagsMutationResponse = {
  __typename?: 'CreateTagsMutationResponse'
  info: CreateInfo
  tags: Array<Tag>
}

export type CreateTrainingsMutationResponse = {
  __typename?: 'CreateTrainingsMutationResponse'
  info: CreateInfo
  trainings: Array<Training>
}

export type CreateUsersMutationResponse = {
  __typename?: 'CreateUsersMutationResponse'
  info: CreateInfo
  users: Array<User>
}

export type DateTimeAggregateSelection = {
  __typename?: 'DateTimeAggregateSelection'
  min?: Maybe<Scalars['DateTime']>
  max?: Maybe<Scalars['DateTime']>
}

export type DeleteInfo = {
  __typename?: 'DeleteInfo'
  bookmark?: Maybe<Scalars['String']>
  nodesDeleted: Scalars['Int']
  relationshipsDeleted: Scalars['Int']
}

export type FloatAggregateSelection = {
  __typename?: 'FloatAggregateSelection'
  max?: Maybe<Scalars['Float']>
  min?: Maybe<Scalars['Float']>
  average?: Maybe<Scalars['Float']>
  sum?: Maybe<Scalars['Float']>
}

export type IdAggregateSelection = {
  __typename?: 'IDAggregateSelection'
  shortest?: Maybe<Scalars['ID']>
  longest?: Maybe<Scalars['ID']>
}

export type IntAggregateSelection = {
  __typename?: 'IntAggregateSelection'
  max?: Maybe<Scalars['Int']>
  min?: Maybe<Scalars['Int']>
  average?: Maybe<Scalars['Float']>
  sum?: Maybe<Scalars['Int']>
}

/** Pagination information (Relay) */
export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
  endCursor?: Maybe<Scalars['String']>
}

export type Post = {
  __typename?: 'Post'
  id: Scalars['String']
  text: Scalars['String']
  viewsCount: Scalars['Int']
  createdAt?: Maybe<Scalars['DateTime']>
  author: User
  authorAggregate?: Maybe<PostUserAuthorAggregationSelection>
  tags: Array<Tag>
  tagsAggregate?: Maybe<PostTagTagsAggregationSelection>
  authorConnection: PostAuthorConnection
  tagsConnection: PostTagsConnection
}

export type PostAuthorArgs = {
  where?: Maybe<UserWhere>
  options?: Maybe<UserOptions>
}

export type PostAuthorAggregateArgs = {
  where?: Maybe<UserWhere>
}

export type PostTagsArgs = {
  where?: Maybe<TagWhere>
  options?: Maybe<TagOptions>
}

export type PostTagsAggregateArgs = {
  where?: Maybe<TagWhere>
}

export type PostAuthorConnectionArgs = {
  where?: Maybe<PostAuthorConnectionWhere>
  sort?: Maybe<Array<PostAuthorConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type PostTagsConnectionArgs = {
  where?: Maybe<PostTagsConnectionWhere>
  sort?: Maybe<Array<PostTagsConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type PostAggregateSelection = {
  __typename?: 'PostAggregateSelection'
  count: Scalars['Int']
  id: StringAggregateSelection
  text: StringAggregateSelection
  viewsCount: IntAggregateSelection
  createdAt: DateTimeAggregateSelection
}

export type PostAuthorConnection = {
  __typename?: 'PostAuthorConnection'
  edges: Array<PostAuthorRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type PostAuthorRelationship = {
  __typename?: 'PostAuthorRelationship'
  cursor: Scalars['String']
  node: User
}

export type PostTagsConnection = {
  __typename?: 'PostTagsConnection'
  edges: Array<PostTagsRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type PostTagsRelationship = {
  __typename?: 'PostTagsRelationship'
  cursor: Scalars['String']
  node: Tag
}

export type PostTagTagsAggregationSelection = {
  __typename?: 'PostTagTagsAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<PostTagTagsNodeAggregateSelection>
}

export type PostTagTagsNodeAggregateSelection = {
  __typename?: 'PostTagTagsNodeAggregateSelection'
  id: StringAggregateSelection
  text: StringAggregateSelection
  createdAt: DateTimeAggregateSelection
}

export type PostUserAuthorAggregationSelection = {
  __typename?: 'PostUserAuthorAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<PostUserAuthorNodeAggregateSelection>
}

export type PostUserAuthorNodeAggregateSelection = {
  __typename?: 'PostUserAuthorNodeAggregateSelection'
  id: StringAggregateSelection
  firstName: StringAggregateSelection
  lastName: StringAggregateSelection
  pictureId: StringAggregateSelection
  about: StringAggregateSelection
  instagram: StringAggregateSelection
  snapchat: StringAggregateSelection
}

export type School = {
  __typename?: 'School'
  googlePlaceId?: Maybe<Scalars['String']>
  id: Scalars['ID']
  lat?: Maybe<Scalars['Float']>
  lng?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
  city?: Maybe<City>
  cityAggregate?: Maybe<SchoolCityCityAggregationSelection>
  users?: Maybe<Array<User>>
  usersAggregate?: Maybe<SchoolUserUsersAggregationSelection>
  cityConnection: SchoolCityConnection
  usersConnection: SchoolUsersConnection
}

export type SchoolCityArgs = {
  where?: Maybe<CityWhere>
  options?: Maybe<CityOptions>
}

export type SchoolCityAggregateArgs = {
  where?: Maybe<CityWhere>
}

export type SchoolUsersArgs = {
  where?: Maybe<UserWhere>
  options?: Maybe<UserOptions>
}

export type SchoolUsersAggregateArgs = {
  where?: Maybe<UserWhere>
}

export type SchoolCityConnectionArgs = {
  where?: Maybe<SchoolCityConnectionWhere>
  sort?: Maybe<Array<SchoolCityConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type SchoolUsersConnectionArgs = {
  where?: Maybe<SchoolUsersConnectionWhere>
  sort?: Maybe<Array<SchoolUsersConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type SchoolAggregateSelection = {
  __typename?: 'SchoolAggregateSelection'
  count: Scalars['Int']
  googlePlaceId: StringAggregateSelection
  id: IdAggregateSelection
  lat: FloatAggregateSelection
  lng: FloatAggregateSelection
  name: StringAggregateSelection
}

export type SchoolCityCityAggregationSelection = {
  __typename?: 'SchoolCityCityAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<SchoolCityCityNodeAggregateSelection>
}

export type SchoolCityCityNodeAggregateSelection = {
  __typename?: 'SchoolCityCityNodeAggregateSelection'
  id: IdAggregateSelection
  name: StringAggregateSelection
  googlePlaceId: StringAggregateSelection
  lat: FloatAggregateSelection
  lng: FloatAggregateSelection
}

export type SchoolCityConnection = {
  __typename?: 'SchoolCityConnection'
  edges: Array<SchoolCityRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type SchoolCityRelationship = {
  __typename?: 'SchoolCityRelationship'
  cursor: Scalars['String']
  node: City
}

export type SchoolUsersConnection = {
  __typename?: 'SchoolUsersConnection'
  edges: Array<SchoolUsersRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type SchoolUsersRelationship = {
  __typename?: 'SchoolUsersRelationship'
  cursor: Scalars['String']
  node: User
}

export type SchoolUserUsersAggregationSelection = {
  __typename?: 'SchoolUserUsersAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<SchoolUserUsersNodeAggregateSelection>
}

export type SchoolUserUsersNodeAggregateSelection = {
  __typename?: 'SchoolUserUsersNodeAggregateSelection'
  id: StringAggregateSelection
  firstName: StringAggregateSelection
  lastName: StringAggregateSelection
  pictureId: StringAggregateSelection
  about: StringAggregateSelection
  instagram: StringAggregateSelection
  snapchat: StringAggregateSelection
}

export type StringAggregateSelection = {
  __typename?: 'StringAggregateSelection'
  shortest?: Maybe<Scalars['String']>
  longest?: Maybe<Scalars['String']>
}

export type Tag = {
  __typename?: 'Tag'
  id: Scalars['String']
  text: Scalars['String']
  createdAt?: Maybe<Scalars['DateTime']>
  author: User
  authorAggregate?: Maybe<TagUserAuthorAggregationSelection>
  posts: Array<Post>
  postsAggregate?: Maybe<TagPostPostsAggregationSelection>
  authorConnection: TagAuthorConnection
  postsConnection: TagPostsConnection
}

export type TagAuthorArgs = {
  where?: Maybe<UserWhere>
  options?: Maybe<UserOptions>
}

export type TagAuthorAggregateArgs = {
  where?: Maybe<UserWhere>
}

export type TagPostsArgs = {
  where?: Maybe<PostWhere>
  options?: Maybe<PostOptions>
}

export type TagPostsAggregateArgs = {
  where?: Maybe<PostWhere>
}

export type TagAuthorConnectionArgs = {
  where?: Maybe<TagAuthorConnectionWhere>
  sort?: Maybe<Array<TagAuthorConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type TagPostsConnectionArgs = {
  where?: Maybe<TagPostsConnectionWhere>
  sort?: Maybe<Array<TagPostsConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type TagAggregateSelection = {
  __typename?: 'TagAggregateSelection'
  count: Scalars['Int']
  id: StringAggregateSelection
  text: StringAggregateSelection
  createdAt: DateTimeAggregateSelection
}

export type TagAuthorConnection = {
  __typename?: 'TagAuthorConnection'
  edges: Array<TagAuthorRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type TagAuthorRelationship = {
  __typename?: 'TagAuthorRelationship'
  cursor: Scalars['String']
  node: User
}

export type TagPostPostsAggregationSelection = {
  __typename?: 'TagPostPostsAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<TagPostPostsNodeAggregateSelection>
}

export type TagPostPostsNodeAggregateSelection = {
  __typename?: 'TagPostPostsNodeAggregateSelection'
  id: StringAggregateSelection
  text: StringAggregateSelection
  viewsCount: IntAggregateSelection
  createdAt: DateTimeAggregateSelection
}

export type TagPostsConnection = {
  __typename?: 'TagPostsConnection'
  edges: Array<TagPostsRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type TagPostsRelationship = {
  __typename?: 'TagPostsRelationship'
  cursor: Scalars['String']
  node: Post
}

export type TagUserAuthorAggregationSelection = {
  __typename?: 'TagUserAuthorAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<TagUserAuthorNodeAggregateSelection>
}

export type TagUserAuthorNodeAggregateSelection = {
  __typename?: 'TagUserAuthorNodeAggregateSelection'
  id: StringAggregateSelection
  firstName: StringAggregateSelection
  lastName: StringAggregateSelection
  pictureId: StringAggregateSelection
  about: StringAggregateSelection
  instagram: StringAggregateSelection
  snapchat: StringAggregateSelection
}

export type Training = {
  __typename?: 'Training'
  id: Scalars['ID']
  name: Scalars['String']
  users?: Maybe<Array<User>>
  usersAggregate?: Maybe<TrainingUserUsersAggregationSelection>
  usersConnection: TrainingUsersConnection
}

export type TrainingUsersArgs = {
  where?: Maybe<UserWhere>
  options?: Maybe<UserOptions>
}

export type TrainingUsersAggregateArgs = {
  where?: Maybe<UserWhere>
}

export type TrainingUsersConnectionArgs = {
  where?: Maybe<TrainingUsersConnectionWhere>
  sort?: Maybe<Array<TrainingUsersConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type TrainingAggregateSelection = {
  __typename?: 'TrainingAggregateSelection'
  count: Scalars['Int']
  id: IdAggregateSelection
  name: StringAggregateSelection
}

export type TrainingUsersConnection = {
  __typename?: 'TrainingUsersConnection'
  edges: Array<TrainingUsersRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type TrainingUsersRelationship = {
  __typename?: 'TrainingUsersRelationship'
  cursor: Scalars['String']
  node: User
}

export type TrainingUserUsersAggregationSelection = {
  __typename?: 'TrainingUserUsersAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<TrainingUserUsersNodeAggregateSelection>
}

export type TrainingUserUsersNodeAggregateSelection = {
  __typename?: 'TrainingUserUsersNodeAggregateSelection'
  id: StringAggregateSelection
  firstName: StringAggregateSelection
  lastName: StringAggregateSelection
  pictureId: StringAggregateSelection
  about: StringAggregateSelection
  instagram: StringAggregateSelection
  snapchat: StringAggregateSelection
}

export type UpdateCitiesMutationResponse = {
  __typename?: 'UpdateCitiesMutationResponse'
  info: UpdateInfo
  cities: Array<City>
}

export type UpdateCountriesMutationResponse = {
  __typename?: 'UpdateCountriesMutationResponse'
  info: UpdateInfo
  countries: Array<Country>
}

export type UpdateInfo = {
  __typename?: 'UpdateInfo'
  bookmark?: Maybe<Scalars['String']>
  nodesCreated: Scalars['Int']
  nodesDeleted: Scalars['Int']
  relationshipsCreated: Scalars['Int']
  relationshipsDeleted: Scalars['Int']
}

export type UpdatePostsMutationResponse = {
  __typename?: 'UpdatePostsMutationResponse'
  info: UpdateInfo
  posts: Array<Post>
}

export type UpdateSchoolsMutationResponse = {
  __typename?: 'UpdateSchoolsMutationResponse'
  info: UpdateInfo
  schools: Array<School>
}

export type UpdateTagsMutationResponse = {
  __typename?: 'UpdateTagsMutationResponse'
  info: UpdateInfo
  tags: Array<Tag>
}

export type UpdateTrainingsMutationResponse = {
  __typename?: 'UpdateTrainingsMutationResponse'
  info: UpdateInfo
  trainings: Array<Training>
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
  school?: Maybe<School>
  schoolAggregate?: Maybe<UserSchoolSchoolAggregationSelection>
  training?: Maybe<Training>
  trainingAggregate?: Maybe<UserTrainingTrainingAggregationSelection>
  friends?: Maybe<Array<Maybe<User>>>
  friendsAggregate?: Maybe<UserUserFriendsAggregationSelection>
  posts: Array<Post>
  postsAggregate?: Maybe<UserPostPostsAggregationSelection>
  tags: Array<Tag>
  tagsAggregate?: Maybe<UserTagTagsAggregationSelection>
  schoolConnection: UserSchoolConnection
  trainingConnection: UserTrainingConnection
  friendsConnection: UserFriendsConnection
  postsConnection: UserPostsConnection
  tagsConnection: UserTagsConnection
}

export type UserSchoolArgs = {
  where?: Maybe<SchoolWhere>
  options?: Maybe<SchoolOptions>
}

export type UserSchoolAggregateArgs = {
  where?: Maybe<SchoolWhere>
}

export type UserTrainingArgs = {
  where?: Maybe<TrainingWhere>
  options?: Maybe<TrainingOptions>
}

export type UserTrainingAggregateArgs = {
  where?: Maybe<TrainingWhere>
}

export type UserFriendsArgs = {
  where?: Maybe<UserWhere>
  options?: Maybe<UserOptions>
}

export type UserFriendsAggregateArgs = {
  where?: Maybe<UserWhere>
}

export type UserPostsArgs = {
  where?: Maybe<PostWhere>
  options?: Maybe<PostOptions>
}

export type UserPostsAggregateArgs = {
  where?: Maybe<PostWhere>
}

export type UserTagsArgs = {
  where?: Maybe<TagWhere>
  options?: Maybe<TagOptions>
}

export type UserTagsAggregateArgs = {
  where?: Maybe<TagWhere>
}

export type UserSchoolConnectionArgs = {
  where?: Maybe<UserSchoolConnectionWhere>
  sort?: Maybe<Array<UserSchoolConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type UserTrainingConnectionArgs = {
  where?: Maybe<UserTrainingConnectionWhere>
  sort?: Maybe<Array<UserTrainingConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type UserFriendsConnectionArgs = {
  where?: Maybe<UserFriendsConnectionWhere>
  sort?: Maybe<Array<UserFriendsConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type UserPostsConnectionArgs = {
  where?: Maybe<UserPostsConnectionWhere>
  sort?: Maybe<Array<UserPostsConnectionSort>>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
}

export type UserTagsConnectionArgs = {
  where?: Maybe<UserTagsConnectionWhere>
  sort?: Maybe<Array<UserTagsConnectionSort>>
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

export type UserPostPostsAggregationSelection = {
  __typename?: 'UserPostPostsAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<UserPostPostsNodeAggregateSelection>
}

export type UserPostPostsNodeAggregateSelection = {
  __typename?: 'UserPostPostsNodeAggregateSelection'
  id: StringAggregateSelection
  text: StringAggregateSelection
  viewsCount: IntAggregateSelection
  createdAt: DateTimeAggregateSelection
}

export type UserPostsConnection = {
  __typename?: 'UserPostsConnection'
  edges: Array<UserPostsRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type UserPostsRelationship = {
  __typename?: 'UserPostsRelationship'
  cursor: Scalars['String']
  node: Post
}

export type UserSchoolConnection = {
  __typename?: 'UserSchoolConnection'
  edges: Array<UserSchoolRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type UserSchoolRelationship = {
  __typename?: 'UserSchoolRelationship'
  cursor: Scalars['String']
  node: School
}

export type UserSchoolSchoolAggregationSelection = {
  __typename?: 'UserSchoolSchoolAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<UserSchoolSchoolNodeAggregateSelection>
}

export type UserSchoolSchoolNodeAggregateSelection = {
  __typename?: 'UserSchoolSchoolNodeAggregateSelection'
  googlePlaceId: StringAggregateSelection
  id: IdAggregateSelection
  lat: FloatAggregateSelection
  lng: FloatAggregateSelection
  name: StringAggregateSelection
}

export type UserTagsConnection = {
  __typename?: 'UserTagsConnection'
  edges: Array<UserTagsRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type UserTagsRelationship = {
  __typename?: 'UserTagsRelationship'
  cursor: Scalars['String']
  node: Tag
}

export type UserTagTagsAggregationSelection = {
  __typename?: 'UserTagTagsAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<UserTagTagsNodeAggregateSelection>
}

export type UserTagTagsNodeAggregateSelection = {
  __typename?: 'UserTagTagsNodeAggregateSelection'
  id: StringAggregateSelection
  text: StringAggregateSelection
  createdAt: DateTimeAggregateSelection
}

export type UserTrainingConnection = {
  __typename?: 'UserTrainingConnection'
  edges: Array<UserTrainingRelationship>
  totalCount: Scalars['Int']
  pageInfo: PageInfo
}

export type UserTrainingRelationship = {
  __typename?: 'UserTrainingRelationship'
  cursor: Scalars['String']
  node: Training
}

export type UserTrainingTrainingAggregationSelection = {
  __typename?: 'UserTrainingTrainingAggregationSelection'
  count: Scalars['Int']
  node?: Maybe<UserTrainingTrainingNodeAggregateSelection>
}

export type UserTrainingTrainingNodeAggregateSelection = {
  __typename?: 'UserTrainingTrainingNodeAggregateSelection'
  id: IdAggregateSelection
  name: StringAggregateSelection
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

export type CityConnectInput = {
  schools?: Maybe<Array<CitySchoolsConnectFieldInput>>
  country?: Maybe<CityCountryConnectFieldInput>
}

export type CityConnectWhere = {
  node: CityWhere
}

export type CityCountryAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<CityCountryAggregateInput>>
  OR?: Maybe<Array<CityCountryAggregateInput>>
  node?: Maybe<CityCountryNodeAggregationWhereInput>
}

export type CityCountryConnectFieldInput = {
  where?: Maybe<CountryConnectWhere>
  connect?: Maybe<CountryConnectInput>
}

export type CityCountryConnectionSort = {
  node?: Maybe<CountrySort>
}

export type CityCountryConnectionWhere = {
  AND?: Maybe<Array<CityCountryConnectionWhere>>
  OR?: Maybe<Array<CityCountryConnectionWhere>>
  node?: Maybe<CountryWhere>
  node_NOT?: Maybe<CountryWhere>
}

export type CityCountryCreateFieldInput = {
  node: CountryCreateInput
}

export type CityCountryDeleteFieldInput = {
  where?: Maybe<CityCountryConnectionWhere>
  delete?: Maybe<CountryDeleteInput>
}

export type CityCountryDisconnectFieldInput = {
  where?: Maybe<CityCountryConnectionWhere>
  disconnect?: Maybe<CountryDisconnectInput>
}

export type CityCountryFieldInput = {
  create?: Maybe<CityCountryCreateFieldInput>
  connect?: Maybe<CityCountryConnectFieldInput>
}

export type CityCountryNodeAggregationWhereInput = {
  AND?: Maybe<Array<CityCountryNodeAggregationWhereInput>>
  OR?: Maybe<Array<CityCountryNodeAggregationWhereInput>>
  id_EQUAL?: Maybe<Scalars['ID']>
  name_EQUAL?: Maybe<Scalars['String']>
  name_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  name_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  name_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  name_GT?: Maybe<Scalars['Int']>
  name_AVERAGE_GT?: Maybe<Scalars['Float']>
  name_LONGEST_GT?: Maybe<Scalars['Int']>
  name_SHORTEST_GT?: Maybe<Scalars['Int']>
  name_GTE?: Maybe<Scalars['Int']>
  name_AVERAGE_GTE?: Maybe<Scalars['Float']>
  name_LONGEST_GTE?: Maybe<Scalars['Int']>
  name_SHORTEST_GTE?: Maybe<Scalars['Int']>
  name_LT?: Maybe<Scalars['Int']>
  name_AVERAGE_LT?: Maybe<Scalars['Float']>
  name_LONGEST_LT?: Maybe<Scalars['Int']>
  name_SHORTEST_LT?: Maybe<Scalars['Int']>
  name_LTE?: Maybe<Scalars['Int']>
  name_AVERAGE_LTE?: Maybe<Scalars['Float']>
  name_LONGEST_LTE?: Maybe<Scalars['Int']>
  name_SHORTEST_LTE?: Maybe<Scalars['Int']>
}

export type CityCountryUpdateConnectionInput = {
  node?: Maybe<CountryUpdateInput>
}

export type CityCountryUpdateFieldInput = {
  where?: Maybe<CityCountryConnectionWhere>
  update?: Maybe<CityCountryUpdateConnectionInput>
  connect?: Maybe<CityCountryConnectFieldInput>
  disconnect?: Maybe<CityCountryDisconnectFieldInput>
  create?: Maybe<CityCountryCreateFieldInput>
  delete?: Maybe<CityCountryDeleteFieldInput>
}

export type CityCreateInput = {
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  googlePlaceId?: Maybe<Scalars['String']>
  lat?: Maybe<Scalars['Float']>
  lng?: Maybe<Scalars['Float']>
  schools?: Maybe<CitySchoolsFieldInput>
  country?: Maybe<CityCountryFieldInput>
}

export type CityDeleteInput = {
  schools?: Maybe<Array<CitySchoolsDeleteFieldInput>>
  country?: Maybe<CityCountryDeleteFieldInput>
}

export type CityDisconnectInput = {
  schools?: Maybe<Array<CitySchoolsDisconnectFieldInput>>
  country?: Maybe<CityCountryDisconnectFieldInput>
}

export type CityOptions = {
  /** Specify one or more CitySort objects to sort Cities by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: Maybe<Array<Maybe<CitySort>>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
}

export type CityRelationInput = {
  schools?: Maybe<Array<CitySchoolsCreateFieldInput>>
  country?: Maybe<CityCountryCreateFieldInput>
}

export type CitySchoolsAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<CitySchoolsAggregateInput>>
  OR?: Maybe<Array<CitySchoolsAggregateInput>>
  node?: Maybe<CitySchoolsNodeAggregationWhereInput>
}

export type CitySchoolsConnectFieldInput = {
  where?: Maybe<SchoolConnectWhere>
  connect?: Maybe<Array<SchoolConnectInput>>
}

export type CitySchoolsConnectionSort = {
  node?: Maybe<SchoolSort>
}

export type CitySchoolsConnectionWhere = {
  AND?: Maybe<Array<CitySchoolsConnectionWhere>>
  OR?: Maybe<Array<CitySchoolsConnectionWhere>>
  node?: Maybe<SchoolWhere>
  node_NOT?: Maybe<SchoolWhere>
}

export type CitySchoolsCreateFieldInput = {
  node: SchoolCreateInput
}

export type CitySchoolsDeleteFieldInput = {
  where?: Maybe<CitySchoolsConnectionWhere>
  delete?: Maybe<SchoolDeleteInput>
}

export type CitySchoolsDisconnectFieldInput = {
  where?: Maybe<CitySchoolsConnectionWhere>
  disconnect?: Maybe<SchoolDisconnectInput>
}

export type CitySchoolsFieldInput = {
  create?: Maybe<Array<CitySchoolsCreateFieldInput>>
  connect?: Maybe<Array<CitySchoolsConnectFieldInput>>
}

export type CitySchoolsNodeAggregationWhereInput = {
  AND?: Maybe<Array<CitySchoolsNodeAggregationWhereInput>>
  OR?: Maybe<Array<CitySchoolsNodeAggregationWhereInput>>
  id_EQUAL?: Maybe<Scalars['ID']>
  googlePlaceId_EQUAL?: Maybe<Scalars['String']>
  googlePlaceId_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  googlePlaceId_GT?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_GT?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_GT?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_GT?: Maybe<Scalars['Int']>
  googlePlaceId_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_GTE?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_LT?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_LT?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_LT?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_LT?: Maybe<Scalars['Int']>
  googlePlaceId_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_LTE?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_LTE?: Maybe<Scalars['Int']>
  name_EQUAL?: Maybe<Scalars['String']>
  name_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  name_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  name_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  name_GT?: Maybe<Scalars['Int']>
  name_AVERAGE_GT?: Maybe<Scalars['Float']>
  name_LONGEST_GT?: Maybe<Scalars['Int']>
  name_SHORTEST_GT?: Maybe<Scalars['Int']>
  name_GTE?: Maybe<Scalars['Int']>
  name_AVERAGE_GTE?: Maybe<Scalars['Float']>
  name_LONGEST_GTE?: Maybe<Scalars['Int']>
  name_SHORTEST_GTE?: Maybe<Scalars['Int']>
  name_LT?: Maybe<Scalars['Int']>
  name_AVERAGE_LT?: Maybe<Scalars['Float']>
  name_LONGEST_LT?: Maybe<Scalars['Int']>
  name_SHORTEST_LT?: Maybe<Scalars['Int']>
  name_LTE?: Maybe<Scalars['Int']>
  name_AVERAGE_LTE?: Maybe<Scalars['Float']>
  name_LONGEST_LTE?: Maybe<Scalars['Int']>
  name_SHORTEST_LTE?: Maybe<Scalars['Int']>
  lat_EQUAL?: Maybe<Scalars['Float']>
  lat_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lat_MIN_EQUAL?: Maybe<Scalars['Float']>
  lat_MAX_EQUAL?: Maybe<Scalars['Float']>
  lat_SUM_EQUAL?: Maybe<Scalars['Float']>
  lat_GT?: Maybe<Scalars['Float']>
  lat_AVERAGE_GT?: Maybe<Scalars['Float']>
  lat_MIN_GT?: Maybe<Scalars['Float']>
  lat_MAX_GT?: Maybe<Scalars['Float']>
  lat_SUM_GT?: Maybe<Scalars['Float']>
  lat_GTE?: Maybe<Scalars['Float']>
  lat_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lat_MIN_GTE?: Maybe<Scalars['Float']>
  lat_MAX_GTE?: Maybe<Scalars['Float']>
  lat_SUM_GTE?: Maybe<Scalars['Float']>
  lat_LT?: Maybe<Scalars['Float']>
  lat_AVERAGE_LT?: Maybe<Scalars['Float']>
  lat_MIN_LT?: Maybe<Scalars['Float']>
  lat_MAX_LT?: Maybe<Scalars['Float']>
  lat_SUM_LT?: Maybe<Scalars['Float']>
  lat_LTE?: Maybe<Scalars['Float']>
  lat_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lat_MIN_LTE?: Maybe<Scalars['Float']>
  lat_MAX_LTE?: Maybe<Scalars['Float']>
  lat_SUM_LTE?: Maybe<Scalars['Float']>
  lng_EQUAL?: Maybe<Scalars['Float']>
  lng_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lng_MIN_EQUAL?: Maybe<Scalars['Float']>
  lng_MAX_EQUAL?: Maybe<Scalars['Float']>
  lng_SUM_EQUAL?: Maybe<Scalars['Float']>
  lng_GT?: Maybe<Scalars['Float']>
  lng_AVERAGE_GT?: Maybe<Scalars['Float']>
  lng_MIN_GT?: Maybe<Scalars['Float']>
  lng_MAX_GT?: Maybe<Scalars['Float']>
  lng_SUM_GT?: Maybe<Scalars['Float']>
  lng_GTE?: Maybe<Scalars['Float']>
  lng_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lng_MIN_GTE?: Maybe<Scalars['Float']>
  lng_MAX_GTE?: Maybe<Scalars['Float']>
  lng_SUM_GTE?: Maybe<Scalars['Float']>
  lng_LT?: Maybe<Scalars['Float']>
  lng_AVERAGE_LT?: Maybe<Scalars['Float']>
  lng_MIN_LT?: Maybe<Scalars['Float']>
  lng_MAX_LT?: Maybe<Scalars['Float']>
  lng_SUM_LT?: Maybe<Scalars['Float']>
  lng_LTE?: Maybe<Scalars['Float']>
  lng_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lng_MIN_LTE?: Maybe<Scalars['Float']>
  lng_MAX_LTE?: Maybe<Scalars['Float']>
  lng_SUM_LTE?: Maybe<Scalars['Float']>
}

export type CitySchoolsUpdateConnectionInput = {
  node?: Maybe<SchoolUpdateInput>
}

export type CitySchoolsUpdateFieldInput = {
  where?: Maybe<CitySchoolsConnectionWhere>
  update?: Maybe<CitySchoolsUpdateConnectionInput>
  connect?: Maybe<Array<CitySchoolsConnectFieldInput>>
  disconnect?: Maybe<Array<CitySchoolsDisconnectFieldInput>>
  create?: Maybe<Array<CitySchoolsCreateFieldInput>>
  delete?: Maybe<Array<CitySchoolsDeleteFieldInput>>
}

/** Fields to sort Cities by. The order in which sorts are applied is not guaranteed when specifying many fields in one CitySort object. */
export type CitySort = {
  id?: Maybe<SortDirection>
  name?: Maybe<SortDirection>
  googlePlaceId?: Maybe<SortDirection>
  lat?: Maybe<SortDirection>
  lng?: Maybe<SortDirection>
}

export type CityUpdateInput = {
  id?: Maybe<Scalars['ID']>
  name?: Maybe<Scalars['String']>
  googlePlaceId?: Maybe<Scalars['String']>
  lat?: Maybe<Scalars['Float']>
  lng?: Maybe<Scalars['Float']>
  schools?: Maybe<Array<CitySchoolsUpdateFieldInput>>
  country?: Maybe<CityCountryUpdateFieldInput>
}

export type CityWhere = {
  OR?: Maybe<Array<CityWhere>>
  AND?: Maybe<Array<CityWhere>>
  id?: Maybe<Scalars['ID']>
  id_NOT?: Maybe<Scalars['ID']>
  id_IN?: Maybe<Array<Maybe<Scalars['ID']>>>
  id_NOT_IN?: Maybe<Array<Maybe<Scalars['ID']>>>
  id_CONTAINS?: Maybe<Scalars['ID']>
  id_NOT_CONTAINS?: Maybe<Scalars['ID']>
  id_STARTS_WITH?: Maybe<Scalars['ID']>
  id_NOT_STARTS_WITH?: Maybe<Scalars['ID']>
  id_ENDS_WITH?: Maybe<Scalars['ID']>
  id_NOT_ENDS_WITH?: Maybe<Scalars['ID']>
  name?: Maybe<Scalars['String']>
  name_NOT?: Maybe<Scalars['String']>
  name_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  name_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  name_CONTAINS?: Maybe<Scalars['String']>
  name_NOT_CONTAINS?: Maybe<Scalars['String']>
  name_STARTS_WITH?: Maybe<Scalars['String']>
  name_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  name_ENDS_WITH?: Maybe<Scalars['String']>
  name_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  googlePlaceId?: Maybe<Scalars['String']>
  googlePlaceId_NOT?: Maybe<Scalars['String']>
  googlePlaceId_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  googlePlaceId_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  googlePlaceId_CONTAINS?: Maybe<Scalars['String']>
  googlePlaceId_NOT_CONTAINS?: Maybe<Scalars['String']>
  googlePlaceId_STARTS_WITH?: Maybe<Scalars['String']>
  googlePlaceId_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  googlePlaceId_ENDS_WITH?: Maybe<Scalars['String']>
  googlePlaceId_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  lat?: Maybe<Scalars['Float']>
  lat_NOT?: Maybe<Scalars['Float']>
  lat_IN?: Maybe<Array<Maybe<Scalars['Float']>>>
  lat_NOT_IN?: Maybe<Array<Maybe<Scalars['Float']>>>
  lat_LT?: Maybe<Scalars['Float']>
  lat_LTE?: Maybe<Scalars['Float']>
  lat_GT?: Maybe<Scalars['Float']>
  lat_GTE?: Maybe<Scalars['Float']>
  lng?: Maybe<Scalars['Float']>
  lng_NOT?: Maybe<Scalars['Float']>
  lng_IN?: Maybe<Array<Maybe<Scalars['Float']>>>
  lng_NOT_IN?: Maybe<Array<Maybe<Scalars['Float']>>>
  lng_LT?: Maybe<Scalars['Float']>
  lng_LTE?: Maybe<Scalars['Float']>
  lng_GT?: Maybe<Scalars['Float']>
  lng_GTE?: Maybe<Scalars['Float']>
  schools?: Maybe<SchoolWhere>
  schools_NOT?: Maybe<SchoolWhere>
  schoolsAggregate?: Maybe<CitySchoolsAggregateInput>
  country?: Maybe<CountryWhere>
  country_NOT?: Maybe<CountryWhere>
  countryAggregate?: Maybe<CityCountryAggregateInput>
  schoolsConnection?: Maybe<CitySchoolsConnectionWhere>
  schoolsConnection_NOT?: Maybe<CitySchoolsConnectionWhere>
  countryConnection?: Maybe<CityCountryConnectionWhere>
  countryConnection_NOT?: Maybe<CityCountryConnectionWhere>
}

export type CountryCitiesAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<CountryCitiesAggregateInput>>
  OR?: Maybe<Array<CountryCitiesAggregateInput>>
  node?: Maybe<CountryCitiesNodeAggregationWhereInput>
}

export type CountryCitiesConnectFieldInput = {
  where?: Maybe<CityConnectWhere>
  connect?: Maybe<Array<CityConnectInput>>
}

export type CountryCitiesConnectionSort = {
  node?: Maybe<CitySort>
}

export type CountryCitiesConnectionWhere = {
  AND?: Maybe<Array<CountryCitiesConnectionWhere>>
  OR?: Maybe<Array<CountryCitiesConnectionWhere>>
  node?: Maybe<CityWhere>
  node_NOT?: Maybe<CityWhere>
}

export type CountryCitiesCreateFieldInput = {
  node: CityCreateInput
}

export type CountryCitiesDeleteFieldInput = {
  where?: Maybe<CountryCitiesConnectionWhere>
  delete?: Maybe<CityDeleteInput>
}

export type CountryCitiesDisconnectFieldInput = {
  where?: Maybe<CountryCitiesConnectionWhere>
  disconnect?: Maybe<CityDisconnectInput>
}

export type CountryCitiesFieldInput = {
  create?: Maybe<Array<CountryCitiesCreateFieldInput>>
  connect?: Maybe<Array<CountryCitiesConnectFieldInput>>
}

export type CountryCitiesNodeAggregationWhereInput = {
  AND?: Maybe<Array<CountryCitiesNodeAggregationWhereInput>>
  OR?: Maybe<Array<CountryCitiesNodeAggregationWhereInput>>
  id_EQUAL?: Maybe<Scalars['ID']>
  name_EQUAL?: Maybe<Scalars['String']>
  name_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  name_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  name_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  name_GT?: Maybe<Scalars['Int']>
  name_AVERAGE_GT?: Maybe<Scalars['Float']>
  name_LONGEST_GT?: Maybe<Scalars['Int']>
  name_SHORTEST_GT?: Maybe<Scalars['Int']>
  name_GTE?: Maybe<Scalars['Int']>
  name_AVERAGE_GTE?: Maybe<Scalars['Float']>
  name_LONGEST_GTE?: Maybe<Scalars['Int']>
  name_SHORTEST_GTE?: Maybe<Scalars['Int']>
  name_LT?: Maybe<Scalars['Int']>
  name_AVERAGE_LT?: Maybe<Scalars['Float']>
  name_LONGEST_LT?: Maybe<Scalars['Int']>
  name_SHORTEST_LT?: Maybe<Scalars['Int']>
  name_LTE?: Maybe<Scalars['Int']>
  name_AVERAGE_LTE?: Maybe<Scalars['Float']>
  name_LONGEST_LTE?: Maybe<Scalars['Int']>
  name_SHORTEST_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_EQUAL?: Maybe<Scalars['String']>
  googlePlaceId_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  googlePlaceId_GT?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_GT?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_GT?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_GT?: Maybe<Scalars['Int']>
  googlePlaceId_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_GTE?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_LT?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_LT?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_LT?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_LT?: Maybe<Scalars['Int']>
  googlePlaceId_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_LTE?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_LTE?: Maybe<Scalars['Int']>
  lat_EQUAL?: Maybe<Scalars['Float']>
  lat_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lat_MIN_EQUAL?: Maybe<Scalars['Float']>
  lat_MAX_EQUAL?: Maybe<Scalars['Float']>
  lat_SUM_EQUAL?: Maybe<Scalars['Float']>
  lat_GT?: Maybe<Scalars['Float']>
  lat_AVERAGE_GT?: Maybe<Scalars['Float']>
  lat_MIN_GT?: Maybe<Scalars['Float']>
  lat_MAX_GT?: Maybe<Scalars['Float']>
  lat_SUM_GT?: Maybe<Scalars['Float']>
  lat_GTE?: Maybe<Scalars['Float']>
  lat_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lat_MIN_GTE?: Maybe<Scalars['Float']>
  lat_MAX_GTE?: Maybe<Scalars['Float']>
  lat_SUM_GTE?: Maybe<Scalars['Float']>
  lat_LT?: Maybe<Scalars['Float']>
  lat_AVERAGE_LT?: Maybe<Scalars['Float']>
  lat_MIN_LT?: Maybe<Scalars['Float']>
  lat_MAX_LT?: Maybe<Scalars['Float']>
  lat_SUM_LT?: Maybe<Scalars['Float']>
  lat_LTE?: Maybe<Scalars['Float']>
  lat_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lat_MIN_LTE?: Maybe<Scalars['Float']>
  lat_MAX_LTE?: Maybe<Scalars['Float']>
  lat_SUM_LTE?: Maybe<Scalars['Float']>
  lng_EQUAL?: Maybe<Scalars['Float']>
  lng_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lng_MIN_EQUAL?: Maybe<Scalars['Float']>
  lng_MAX_EQUAL?: Maybe<Scalars['Float']>
  lng_SUM_EQUAL?: Maybe<Scalars['Float']>
  lng_GT?: Maybe<Scalars['Float']>
  lng_AVERAGE_GT?: Maybe<Scalars['Float']>
  lng_MIN_GT?: Maybe<Scalars['Float']>
  lng_MAX_GT?: Maybe<Scalars['Float']>
  lng_SUM_GT?: Maybe<Scalars['Float']>
  lng_GTE?: Maybe<Scalars['Float']>
  lng_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lng_MIN_GTE?: Maybe<Scalars['Float']>
  lng_MAX_GTE?: Maybe<Scalars['Float']>
  lng_SUM_GTE?: Maybe<Scalars['Float']>
  lng_LT?: Maybe<Scalars['Float']>
  lng_AVERAGE_LT?: Maybe<Scalars['Float']>
  lng_MIN_LT?: Maybe<Scalars['Float']>
  lng_MAX_LT?: Maybe<Scalars['Float']>
  lng_SUM_LT?: Maybe<Scalars['Float']>
  lng_LTE?: Maybe<Scalars['Float']>
  lng_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lng_MIN_LTE?: Maybe<Scalars['Float']>
  lng_MAX_LTE?: Maybe<Scalars['Float']>
  lng_SUM_LTE?: Maybe<Scalars['Float']>
}

export type CountryCitiesUpdateConnectionInput = {
  node?: Maybe<CityUpdateInput>
}

export type CountryCitiesUpdateFieldInput = {
  where?: Maybe<CountryCitiesConnectionWhere>
  update?: Maybe<CountryCitiesUpdateConnectionInput>
  connect?: Maybe<Array<CountryCitiesConnectFieldInput>>
  disconnect?: Maybe<Array<CountryCitiesDisconnectFieldInput>>
  create?: Maybe<Array<CountryCitiesCreateFieldInput>>
  delete?: Maybe<Array<CountryCitiesDeleteFieldInput>>
}

export type CountryConnectInput = {
  cities?: Maybe<Array<CountryCitiesConnectFieldInput>>
}

export type CountryConnectWhere = {
  node: CountryWhere
}

export type CountryCreateInput = {
  id: Scalars['ID']
  name: Scalars['String']
  cities?: Maybe<CountryCitiesFieldInput>
}

export type CountryDeleteInput = {
  cities?: Maybe<Array<CountryCitiesDeleteFieldInput>>
}

export type CountryDisconnectInput = {
  cities?: Maybe<Array<CountryCitiesDisconnectFieldInput>>
}

export type CountryOptions = {
  /** Specify one or more CountrySort objects to sort Countries by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: Maybe<Array<Maybe<CountrySort>>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
}

export type CountryRelationInput = {
  cities?: Maybe<Array<CountryCitiesCreateFieldInput>>
}

/** Fields to sort Countries by. The order in which sorts are applied is not guaranteed when specifying many fields in one CountrySort object. */
export type CountrySort = {
  id?: Maybe<SortDirection>
  name?: Maybe<SortDirection>
}

export type CountryUpdateInput = {
  id?: Maybe<Scalars['ID']>
  name?: Maybe<Scalars['String']>
  cities?: Maybe<Array<CountryCitiesUpdateFieldInput>>
}

export type CountryWhere = {
  OR?: Maybe<Array<CountryWhere>>
  AND?: Maybe<Array<CountryWhere>>
  id?: Maybe<Scalars['ID']>
  id_NOT?: Maybe<Scalars['ID']>
  id_IN?: Maybe<Array<Maybe<Scalars['ID']>>>
  id_NOT_IN?: Maybe<Array<Maybe<Scalars['ID']>>>
  id_CONTAINS?: Maybe<Scalars['ID']>
  id_NOT_CONTAINS?: Maybe<Scalars['ID']>
  id_STARTS_WITH?: Maybe<Scalars['ID']>
  id_NOT_STARTS_WITH?: Maybe<Scalars['ID']>
  id_ENDS_WITH?: Maybe<Scalars['ID']>
  id_NOT_ENDS_WITH?: Maybe<Scalars['ID']>
  name?: Maybe<Scalars['String']>
  name_NOT?: Maybe<Scalars['String']>
  name_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  name_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  name_CONTAINS?: Maybe<Scalars['String']>
  name_NOT_CONTAINS?: Maybe<Scalars['String']>
  name_STARTS_WITH?: Maybe<Scalars['String']>
  name_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  name_ENDS_WITH?: Maybe<Scalars['String']>
  name_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  cities?: Maybe<CityWhere>
  cities_NOT?: Maybe<CityWhere>
  citiesAggregate?: Maybe<CountryCitiesAggregateInput>
  citiesConnection?: Maybe<CountryCitiesConnectionWhere>
  citiesConnection_NOT?: Maybe<CountryCitiesConnectionWhere>
}

export type PostAuthorAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<PostAuthorAggregateInput>>
  OR?: Maybe<Array<PostAuthorAggregateInput>>
  node?: Maybe<PostAuthorNodeAggregationWhereInput>
}

export type PostAuthorConnectFieldInput = {
  where?: Maybe<UserConnectWhere>
  connect?: Maybe<UserConnectInput>
}

export type PostAuthorConnectionSort = {
  node?: Maybe<UserSort>
}

export type PostAuthorConnectionWhere = {
  AND?: Maybe<Array<PostAuthorConnectionWhere>>
  OR?: Maybe<Array<PostAuthorConnectionWhere>>
  node?: Maybe<UserWhere>
  node_NOT?: Maybe<UserWhere>
}

export type PostAuthorCreateFieldInput = {
  node: UserCreateInput
}

export type PostAuthorDeleteFieldInput = {
  where?: Maybe<PostAuthorConnectionWhere>
  delete?: Maybe<UserDeleteInput>
}

export type PostAuthorDisconnectFieldInput = {
  where?: Maybe<PostAuthorConnectionWhere>
  disconnect?: Maybe<UserDisconnectInput>
}

export type PostAuthorFieldInput = {
  create?: Maybe<PostAuthorCreateFieldInput>
  connect?: Maybe<PostAuthorConnectFieldInput>
}

export type PostAuthorNodeAggregationWhereInput = {
  AND?: Maybe<Array<PostAuthorNodeAggregationWhereInput>>
  OR?: Maybe<Array<PostAuthorNodeAggregationWhereInput>>
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

export type PostAuthorUpdateConnectionInput = {
  node?: Maybe<UserUpdateInput>
}

export type PostAuthorUpdateFieldInput = {
  where?: Maybe<PostAuthorConnectionWhere>
  update?: Maybe<PostAuthorUpdateConnectionInput>
  connect?: Maybe<PostAuthorConnectFieldInput>
  disconnect?: Maybe<PostAuthorDisconnectFieldInput>
  create?: Maybe<PostAuthorCreateFieldInput>
  delete?: Maybe<PostAuthorDeleteFieldInput>
}

export type PostConnectInput = {
  author?: Maybe<PostAuthorConnectFieldInput>
  tags?: Maybe<Array<PostTagsConnectFieldInput>>
}

export type PostConnectWhere = {
  node: PostWhere
}

export type PostCreateInput = {
  id: Scalars['String']
  text: Scalars['String']
  viewsCount: Scalars['Int']
  createdAt?: Maybe<Scalars['DateTime']>
  author?: Maybe<PostAuthorFieldInput>
  tags?: Maybe<PostTagsFieldInput>
}

export type PostDeleteInput = {
  author?: Maybe<PostAuthorDeleteFieldInput>
  tags?: Maybe<Array<PostTagsDeleteFieldInput>>
}

export type PostDisconnectInput = {
  author?: Maybe<PostAuthorDisconnectFieldInput>
  tags?: Maybe<Array<PostTagsDisconnectFieldInput>>
}

export type PostOptions = {
  /** Specify one or more PostSort objects to sort Posts by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: Maybe<Array<Maybe<PostSort>>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
}

export type PostRelationInput = {
  author?: Maybe<PostAuthorCreateFieldInput>
  tags?: Maybe<Array<PostTagsCreateFieldInput>>
}

/** Fields to sort Posts by. The order in which sorts are applied is not guaranteed when specifying many fields in one PostSort object. */
export type PostSort = {
  id?: Maybe<SortDirection>
  text?: Maybe<SortDirection>
  viewsCount?: Maybe<SortDirection>
  createdAt?: Maybe<SortDirection>
}

export type PostTagsAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<PostTagsAggregateInput>>
  OR?: Maybe<Array<PostTagsAggregateInput>>
  node?: Maybe<PostTagsNodeAggregationWhereInput>
}

export type PostTagsConnectFieldInput = {
  where?: Maybe<TagConnectWhere>
  connect?: Maybe<Array<TagConnectInput>>
}

export type PostTagsConnectionSort = {
  node?: Maybe<TagSort>
}

export type PostTagsConnectionWhere = {
  AND?: Maybe<Array<PostTagsConnectionWhere>>
  OR?: Maybe<Array<PostTagsConnectionWhere>>
  node?: Maybe<TagWhere>
  node_NOT?: Maybe<TagWhere>
}

export type PostTagsCreateFieldInput = {
  node: TagCreateInput
}

export type PostTagsDeleteFieldInput = {
  where?: Maybe<PostTagsConnectionWhere>
  delete?: Maybe<TagDeleteInput>
}

export type PostTagsDisconnectFieldInput = {
  where?: Maybe<PostTagsConnectionWhere>
  disconnect?: Maybe<TagDisconnectInput>
}

export type PostTagsFieldInput = {
  create?: Maybe<Array<PostTagsCreateFieldInput>>
  connect?: Maybe<Array<PostTagsConnectFieldInput>>
}

export type PostTagsNodeAggregationWhereInput = {
  AND?: Maybe<Array<PostTagsNodeAggregationWhereInput>>
  OR?: Maybe<Array<PostTagsNodeAggregationWhereInput>>
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
  text_EQUAL?: Maybe<Scalars['String']>
  text_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  text_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  text_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  text_GT?: Maybe<Scalars['Int']>
  text_AVERAGE_GT?: Maybe<Scalars['Float']>
  text_LONGEST_GT?: Maybe<Scalars['Int']>
  text_SHORTEST_GT?: Maybe<Scalars['Int']>
  text_GTE?: Maybe<Scalars['Int']>
  text_AVERAGE_GTE?: Maybe<Scalars['Float']>
  text_LONGEST_GTE?: Maybe<Scalars['Int']>
  text_SHORTEST_GTE?: Maybe<Scalars['Int']>
  text_LT?: Maybe<Scalars['Int']>
  text_AVERAGE_LT?: Maybe<Scalars['Float']>
  text_LONGEST_LT?: Maybe<Scalars['Int']>
  text_SHORTEST_LT?: Maybe<Scalars['Int']>
  text_LTE?: Maybe<Scalars['Int']>
  text_AVERAGE_LTE?: Maybe<Scalars['Float']>
  text_LONGEST_LTE?: Maybe<Scalars['Int']>
  text_SHORTEST_LTE?: Maybe<Scalars['Int']>
  createdAt_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_MIN_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_MAX_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_GT?: Maybe<Scalars['DateTime']>
  createdAt_MIN_GT?: Maybe<Scalars['DateTime']>
  createdAt_MAX_GT?: Maybe<Scalars['DateTime']>
  createdAt_GTE?: Maybe<Scalars['DateTime']>
  createdAt_MIN_GTE?: Maybe<Scalars['DateTime']>
  createdAt_MAX_GTE?: Maybe<Scalars['DateTime']>
  createdAt_LT?: Maybe<Scalars['DateTime']>
  createdAt_MIN_LT?: Maybe<Scalars['DateTime']>
  createdAt_MAX_LT?: Maybe<Scalars['DateTime']>
  createdAt_LTE?: Maybe<Scalars['DateTime']>
  createdAt_MIN_LTE?: Maybe<Scalars['DateTime']>
  createdAt_MAX_LTE?: Maybe<Scalars['DateTime']>
}

export type PostTagsUpdateConnectionInput = {
  node?: Maybe<TagUpdateInput>
}

export type PostTagsUpdateFieldInput = {
  where?: Maybe<PostTagsConnectionWhere>
  update?: Maybe<PostTagsUpdateConnectionInput>
  connect?: Maybe<Array<PostTagsConnectFieldInput>>
  disconnect?: Maybe<Array<PostTagsDisconnectFieldInput>>
  create?: Maybe<Array<PostTagsCreateFieldInput>>
  delete?: Maybe<Array<PostTagsDeleteFieldInput>>
}

export type PostUpdateInput = {
  id?: Maybe<Scalars['String']>
  text?: Maybe<Scalars['String']>
  viewsCount?: Maybe<Scalars['Int']>
  createdAt?: Maybe<Scalars['DateTime']>
  author?: Maybe<PostAuthorUpdateFieldInput>
  tags?: Maybe<Array<PostTagsUpdateFieldInput>>
}

export type PostWhere = {
  OR?: Maybe<Array<PostWhere>>
  AND?: Maybe<Array<PostWhere>>
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
  text?: Maybe<Scalars['String']>
  text_NOT?: Maybe<Scalars['String']>
  text_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  text_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  text_CONTAINS?: Maybe<Scalars['String']>
  text_NOT_CONTAINS?: Maybe<Scalars['String']>
  text_STARTS_WITH?: Maybe<Scalars['String']>
  text_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  text_ENDS_WITH?: Maybe<Scalars['String']>
  text_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  viewsCount?: Maybe<Scalars['Int']>
  viewsCount_NOT?: Maybe<Scalars['Int']>
  viewsCount_IN?: Maybe<Array<Maybe<Scalars['Int']>>>
  viewsCount_NOT_IN?: Maybe<Array<Maybe<Scalars['Int']>>>
  viewsCount_LT?: Maybe<Scalars['Int']>
  viewsCount_LTE?: Maybe<Scalars['Int']>
  viewsCount_GT?: Maybe<Scalars['Int']>
  viewsCount_GTE?: Maybe<Scalars['Int']>
  createdAt?: Maybe<Scalars['DateTime']>
  createdAt_NOT?: Maybe<Scalars['DateTime']>
  createdAt_IN?: Maybe<Array<Maybe<Scalars['DateTime']>>>
  createdAt_NOT_IN?: Maybe<Array<Maybe<Scalars['DateTime']>>>
  createdAt_LT?: Maybe<Scalars['DateTime']>
  createdAt_LTE?: Maybe<Scalars['DateTime']>
  createdAt_GT?: Maybe<Scalars['DateTime']>
  createdAt_GTE?: Maybe<Scalars['DateTime']>
  author?: Maybe<UserWhere>
  author_NOT?: Maybe<UserWhere>
  authorAggregate?: Maybe<PostAuthorAggregateInput>
  tags?: Maybe<TagWhere>
  tags_NOT?: Maybe<TagWhere>
  tagsAggregate?: Maybe<PostTagsAggregateInput>
  authorConnection?: Maybe<PostAuthorConnectionWhere>
  authorConnection_NOT?: Maybe<PostAuthorConnectionWhere>
  tagsConnection?: Maybe<PostTagsConnectionWhere>
  tagsConnection_NOT?: Maybe<PostTagsConnectionWhere>
}

export type SchoolCityAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<SchoolCityAggregateInput>>
  OR?: Maybe<Array<SchoolCityAggregateInput>>
  node?: Maybe<SchoolCityNodeAggregationWhereInput>
}

export type SchoolCityConnectFieldInput = {
  where?: Maybe<CityConnectWhere>
  connect?: Maybe<CityConnectInput>
}

export type SchoolCityConnectionSort = {
  node?: Maybe<CitySort>
}

export type SchoolCityConnectionWhere = {
  AND?: Maybe<Array<SchoolCityConnectionWhere>>
  OR?: Maybe<Array<SchoolCityConnectionWhere>>
  node?: Maybe<CityWhere>
  node_NOT?: Maybe<CityWhere>
}

export type SchoolCityCreateFieldInput = {
  node: CityCreateInput
}

export type SchoolCityDeleteFieldInput = {
  where?: Maybe<SchoolCityConnectionWhere>
  delete?: Maybe<CityDeleteInput>
}

export type SchoolCityDisconnectFieldInput = {
  where?: Maybe<SchoolCityConnectionWhere>
  disconnect?: Maybe<CityDisconnectInput>
}

export type SchoolCityFieldInput = {
  create?: Maybe<SchoolCityCreateFieldInput>
  connect?: Maybe<SchoolCityConnectFieldInput>
}

export type SchoolCityNodeAggregationWhereInput = {
  AND?: Maybe<Array<SchoolCityNodeAggregationWhereInput>>
  OR?: Maybe<Array<SchoolCityNodeAggregationWhereInput>>
  id_EQUAL?: Maybe<Scalars['ID']>
  name_EQUAL?: Maybe<Scalars['String']>
  name_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  name_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  name_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  name_GT?: Maybe<Scalars['Int']>
  name_AVERAGE_GT?: Maybe<Scalars['Float']>
  name_LONGEST_GT?: Maybe<Scalars['Int']>
  name_SHORTEST_GT?: Maybe<Scalars['Int']>
  name_GTE?: Maybe<Scalars['Int']>
  name_AVERAGE_GTE?: Maybe<Scalars['Float']>
  name_LONGEST_GTE?: Maybe<Scalars['Int']>
  name_SHORTEST_GTE?: Maybe<Scalars['Int']>
  name_LT?: Maybe<Scalars['Int']>
  name_AVERAGE_LT?: Maybe<Scalars['Float']>
  name_LONGEST_LT?: Maybe<Scalars['Int']>
  name_SHORTEST_LT?: Maybe<Scalars['Int']>
  name_LTE?: Maybe<Scalars['Int']>
  name_AVERAGE_LTE?: Maybe<Scalars['Float']>
  name_LONGEST_LTE?: Maybe<Scalars['Int']>
  name_SHORTEST_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_EQUAL?: Maybe<Scalars['String']>
  googlePlaceId_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  googlePlaceId_GT?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_GT?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_GT?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_GT?: Maybe<Scalars['Int']>
  googlePlaceId_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_GTE?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_LT?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_LT?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_LT?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_LT?: Maybe<Scalars['Int']>
  googlePlaceId_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_LTE?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_LTE?: Maybe<Scalars['Int']>
  lat_EQUAL?: Maybe<Scalars['Float']>
  lat_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lat_MIN_EQUAL?: Maybe<Scalars['Float']>
  lat_MAX_EQUAL?: Maybe<Scalars['Float']>
  lat_SUM_EQUAL?: Maybe<Scalars['Float']>
  lat_GT?: Maybe<Scalars['Float']>
  lat_AVERAGE_GT?: Maybe<Scalars['Float']>
  lat_MIN_GT?: Maybe<Scalars['Float']>
  lat_MAX_GT?: Maybe<Scalars['Float']>
  lat_SUM_GT?: Maybe<Scalars['Float']>
  lat_GTE?: Maybe<Scalars['Float']>
  lat_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lat_MIN_GTE?: Maybe<Scalars['Float']>
  lat_MAX_GTE?: Maybe<Scalars['Float']>
  lat_SUM_GTE?: Maybe<Scalars['Float']>
  lat_LT?: Maybe<Scalars['Float']>
  lat_AVERAGE_LT?: Maybe<Scalars['Float']>
  lat_MIN_LT?: Maybe<Scalars['Float']>
  lat_MAX_LT?: Maybe<Scalars['Float']>
  lat_SUM_LT?: Maybe<Scalars['Float']>
  lat_LTE?: Maybe<Scalars['Float']>
  lat_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lat_MIN_LTE?: Maybe<Scalars['Float']>
  lat_MAX_LTE?: Maybe<Scalars['Float']>
  lat_SUM_LTE?: Maybe<Scalars['Float']>
  lng_EQUAL?: Maybe<Scalars['Float']>
  lng_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lng_MIN_EQUAL?: Maybe<Scalars['Float']>
  lng_MAX_EQUAL?: Maybe<Scalars['Float']>
  lng_SUM_EQUAL?: Maybe<Scalars['Float']>
  lng_GT?: Maybe<Scalars['Float']>
  lng_AVERAGE_GT?: Maybe<Scalars['Float']>
  lng_MIN_GT?: Maybe<Scalars['Float']>
  lng_MAX_GT?: Maybe<Scalars['Float']>
  lng_SUM_GT?: Maybe<Scalars['Float']>
  lng_GTE?: Maybe<Scalars['Float']>
  lng_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lng_MIN_GTE?: Maybe<Scalars['Float']>
  lng_MAX_GTE?: Maybe<Scalars['Float']>
  lng_SUM_GTE?: Maybe<Scalars['Float']>
  lng_LT?: Maybe<Scalars['Float']>
  lng_AVERAGE_LT?: Maybe<Scalars['Float']>
  lng_MIN_LT?: Maybe<Scalars['Float']>
  lng_MAX_LT?: Maybe<Scalars['Float']>
  lng_SUM_LT?: Maybe<Scalars['Float']>
  lng_LTE?: Maybe<Scalars['Float']>
  lng_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lng_MIN_LTE?: Maybe<Scalars['Float']>
  lng_MAX_LTE?: Maybe<Scalars['Float']>
  lng_SUM_LTE?: Maybe<Scalars['Float']>
}

export type SchoolCityUpdateConnectionInput = {
  node?: Maybe<CityUpdateInput>
}

export type SchoolCityUpdateFieldInput = {
  where?: Maybe<SchoolCityConnectionWhere>
  update?: Maybe<SchoolCityUpdateConnectionInput>
  connect?: Maybe<SchoolCityConnectFieldInput>
  disconnect?: Maybe<SchoolCityDisconnectFieldInput>
  create?: Maybe<SchoolCityCreateFieldInput>
  delete?: Maybe<SchoolCityDeleteFieldInput>
}

export type SchoolConnectInput = {
  city?: Maybe<SchoolCityConnectFieldInput>
  users?: Maybe<Array<SchoolUsersConnectFieldInput>>
}

export type SchoolConnectWhere = {
  node: SchoolWhere
}

export type SchoolCreateInput = {
  googlePlaceId?: Maybe<Scalars['String']>
  id: Scalars['ID']
  lat?: Maybe<Scalars['Float']>
  lng?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
  city?: Maybe<SchoolCityFieldInput>
  users?: Maybe<SchoolUsersFieldInput>
}

export type SchoolDeleteInput = {
  city?: Maybe<SchoolCityDeleteFieldInput>
  users?: Maybe<Array<SchoolUsersDeleteFieldInput>>
}

export type SchoolDisconnectInput = {
  city?: Maybe<SchoolCityDisconnectFieldInput>
  users?: Maybe<Array<SchoolUsersDisconnectFieldInput>>
}

export type SchoolOptions = {
  /** Specify one or more SchoolSort objects to sort Schools by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: Maybe<Array<Maybe<SchoolSort>>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
}

export type SchoolRelationInput = {
  city?: Maybe<SchoolCityCreateFieldInput>
  users?: Maybe<Array<SchoolUsersCreateFieldInput>>
}

/** Fields to sort Schools by. The order in which sorts are applied is not guaranteed when specifying many fields in one SchoolSort object. */
export type SchoolSort = {
  googlePlaceId?: Maybe<SortDirection>
  id?: Maybe<SortDirection>
  lat?: Maybe<SortDirection>
  lng?: Maybe<SortDirection>
  name?: Maybe<SortDirection>
}

export type SchoolUpdateInput = {
  googlePlaceId?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
  lat?: Maybe<Scalars['Float']>
  lng?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
  city?: Maybe<SchoolCityUpdateFieldInput>
  users?: Maybe<Array<SchoolUsersUpdateFieldInput>>
}

export type SchoolUsersAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<SchoolUsersAggregateInput>>
  OR?: Maybe<Array<SchoolUsersAggregateInput>>
  node?: Maybe<SchoolUsersNodeAggregationWhereInput>
}

export type SchoolUsersConnectFieldInput = {
  where?: Maybe<UserConnectWhere>
  connect?: Maybe<Array<UserConnectInput>>
}

export type SchoolUsersConnectionSort = {
  node?: Maybe<UserSort>
}

export type SchoolUsersConnectionWhere = {
  AND?: Maybe<Array<SchoolUsersConnectionWhere>>
  OR?: Maybe<Array<SchoolUsersConnectionWhere>>
  node?: Maybe<UserWhere>
  node_NOT?: Maybe<UserWhere>
}

export type SchoolUsersCreateFieldInput = {
  node: UserCreateInput
}

export type SchoolUsersDeleteFieldInput = {
  where?: Maybe<SchoolUsersConnectionWhere>
  delete?: Maybe<UserDeleteInput>
}

export type SchoolUsersDisconnectFieldInput = {
  where?: Maybe<SchoolUsersConnectionWhere>
  disconnect?: Maybe<UserDisconnectInput>
}

export type SchoolUsersFieldInput = {
  create?: Maybe<Array<SchoolUsersCreateFieldInput>>
  connect?: Maybe<Array<SchoolUsersConnectFieldInput>>
}

export type SchoolUsersNodeAggregationWhereInput = {
  AND?: Maybe<Array<SchoolUsersNodeAggregationWhereInput>>
  OR?: Maybe<Array<SchoolUsersNodeAggregationWhereInput>>
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

export type SchoolUsersUpdateConnectionInput = {
  node?: Maybe<UserUpdateInput>
}

export type SchoolUsersUpdateFieldInput = {
  where?: Maybe<SchoolUsersConnectionWhere>
  update?: Maybe<SchoolUsersUpdateConnectionInput>
  connect?: Maybe<Array<SchoolUsersConnectFieldInput>>
  disconnect?: Maybe<Array<SchoolUsersDisconnectFieldInput>>
  create?: Maybe<Array<SchoolUsersCreateFieldInput>>
  delete?: Maybe<Array<SchoolUsersDeleteFieldInput>>
}

export type SchoolWhere = {
  OR?: Maybe<Array<SchoolWhere>>
  AND?: Maybe<Array<SchoolWhere>>
  googlePlaceId?: Maybe<Scalars['String']>
  googlePlaceId_NOT?: Maybe<Scalars['String']>
  googlePlaceId_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  googlePlaceId_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  googlePlaceId_CONTAINS?: Maybe<Scalars['String']>
  googlePlaceId_NOT_CONTAINS?: Maybe<Scalars['String']>
  googlePlaceId_STARTS_WITH?: Maybe<Scalars['String']>
  googlePlaceId_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  googlePlaceId_ENDS_WITH?: Maybe<Scalars['String']>
  googlePlaceId_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
  id_NOT?: Maybe<Scalars['ID']>
  id_IN?: Maybe<Array<Maybe<Scalars['ID']>>>
  id_NOT_IN?: Maybe<Array<Maybe<Scalars['ID']>>>
  id_CONTAINS?: Maybe<Scalars['ID']>
  id_NOT_CONTAINS?: Maybe<Scalars['ID']>
  id_STARTS_WITH?: Maybe<Scalars['ID']>
  id_NOT_STARTS_WITH?: Maybe<Scalars['ID']>
  id_ENDS_WITH?: Maybe<Scalars['ID']>
  id_NOT_ENDS_WITH?: Maybe<Scalars['ID']>
  lat?: Maybe<Scalars['Float']>
  lat_NOT?: Maybe<Scalars['Float']>
  lat_IN?: Maybe<Array<Maybe<Scalars['Float']>>>
  lat_NOT_IN?: Maybe<Array<Maybe<Scalars['Float']>>>
  lat_LT?: Maybe<Scalars['Float']>
  lat_LTE?: Maybe<Scalars['Float']>
  lat_GT?: Maybe<Scalars['Float']>
  lat_GTE?: Maybe<Scalars['Float']>
  lng?: Maybe<Scalars['Float']>
  lng_NOT?: Maybe<Scalars['Float']>
  lng_IN?: Maybe<Array<Maybe<Scalars['Float']>>>
  lng_NOT_IN?: Maybe<Array<Maybe<Scalars['Float']>>>
  lng_LT?: Maybe<Scalars['Float']>
  lng_LTE?: Maybe<Scalars['Float']>
  lng_GT?: Maybe<Scalars['Float']>
  lng_GTE?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
  name_NOT?: Maybe<Scalars['String']>
  name_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  name_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  name_CONTAINS?: Maybe<Scalars['String']>
  name_NOT_CONTAINS?: Maybe<Scalars['String']>
  name_STARTS_WITH?: Maybe<Scalars['String']>
  name_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  name_ENDS_WITH?: Maybe<Scalars['String']>
  name_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  city?: Maybe<CityWhere>
  city_NOT?: Maybe<CityWhere>
  cityAggregate?: Maybe<SchoolCityAggregateInput>
  users?: Maybe<UserWhere>
  users_NOT?: Maybe<UserWhere>
  usersAggregate?: Maybe<SchoolUsersAggregateInput>
  cityConnection?: Maybe<SchoolCityConnectionWhere>
  cityConnection_NOT?: Maybe<SchoolCityConnectionWhere>
  usersConnection?: Maybe<SchoolUsersConnectionWhere>
  usersConnection_NOT?: Maybe<SchoolUsersConnectionWhere>
}

export type TagAuthorAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<TagAuthorAggregateInput>>
  OR?: Maybe<Array<TagAuthorAggregateInput>>
  node?: Maybe<TagAuthorNodeAggregationWhereInput>
}

export type TagAuthorConnectFieldInput = {
  where?: Maybe<UserConnectWhere>
  connect?: Maybe<UserConnectInput>
}

export type TagAuthorConnectionSort = {
  node?: Maybe<UserSort>
}

export type TagAuthorConnectionWhere = {
  AND?: Maybe<Array<TagAuthorConnectionWhere>>
  OR?: Maybe<Array<TagAuthorConnectionWhere>>
  node?: Maybe<UserWhere>
  node_NOT?: Maybe<UserWhere>
}

export type TagAuthorCreateFieldInput = {
  node: UserCreateInput
}

export type TagAuthorDeleteFieldInput = {
  where?: Maybe<TagAuthorConnectionWhere>
  delete?: Maybe<UserDeleteInput>
}

export type TagAuthorDisconnectFieldInput = {
  where?: Maybe<TagAuthorConnectionWhere>
  disconnect?: Maybe<UserDisconnectInput>
}

export type TagAuthorFieldInput = {
  create?: Maybe<TagAuthorCreateFieldInput>
  connect?: Maybe<TagAuthorConnectFieldInput>
}

export type TagAuthorNodeAggregationWhereInput = {
  AND?: Maybe<Array<TagAuthorNodeAggregationWhereInput>>
  OR?: Maybe<Array<TagAuthorNodeAggregationWhereInput>>
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

export type TagAuthorUpdateConnectionInput = {
  node?: Maybe<UserUpdateInput>
}

export type TagAuthorUpdateFieldInput = {
  where?: Maybe<TagAuthorConnectionWhere>
  update?: Maybe<TagAuthorUpdateConnectionInput>
  connect?: Maybe<TagAuthorConnectFieldInput>
  disconnect?: Maybe<TagAuthorDisconnectFieldInput>
  create?: Maybe<TagAuthorCreateFieldInput>
  delete?: Maybe<TagAuthorDeleteFieldInput>
}

export type TagConnectInput = {
  author?: Maybe<TagAuthorConnectFieldInput>
  posts?: Maybe<Array<TagPostsConnectFieldInput>>
}

export type TagConnectWhere = {
  node: TagWhere
}

export type TagCreateInput = {
  id: Scalars['String']
  text: Scalars['String']
  createdAt?: Maybe<Scalars['DateTime']>
  author?: Maybe<TagAuthorFieldInput>
  posts?: Maybe<TagPostsFieldInput>
}

export type TagDeleteInput = {
  author?: Maybe<TagAuthorDeleteFieldInput>
  posts?: Maybe<Array<TagPostsDeleteFieldInput>>
}

export type TagDisconnectInput = {
  author?: Maybe<TagAuthorDisconnectFieldInput>
  posts?: Maybe<Array<TagPostsDisconnectFieldInput>>
}

export type TagOptions = {
  /** Specify one or more TagSort objects to sort Tags by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: Maybe<Array<Maybe<TagSort>>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
}

export type TagPostsAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<TagPostsAggregateInput>>
  OR?: Maybe<Array<TagPostsAggregateInput>>
  node?: Maybe<TagPostsNodeAggregationWhereInput>
}

export type TagPostsConnectFieldInput = {
  where?: Maybe<PostConnectWhere>
  connect?: Maybe<Array<PostConnectInput>>
}

export type TagPostsConnectionSort = {
  node?: Maybe<PostSort>
}

export type TagPostsConnectionWhere = {
  AND?: Maybe<Array<TagPostsConnectionWhere>>
  OR?: Maybe<Array<TagPostsConnectionWhere>>
  node?: Maybe<PostWhere>
  node_NOT?: Maybe<PostWhere>
}

export type TagPostsCreateFieldInput = {
  node: PostCreateInput
}

export type TagPostsDeleteFieldInput = {
  where?: Maybe<TagPostsConnectionWhere>
  delete?: Maybe<PostDeleteInput>
}

export type TagPostsDisconnectFieldInput = {
  where?: Maybe<TagPostsConnectionWhere>
  disconnect?: Maybe<PostDisconnectInput>
}

export type TagPostsFieldInput = {
  create?: Maybe<Array<TagPostsCreateFieldInput>>
  connect?: Maybe<Array<TagPostsConnectFieldInput>>
}

export type TagPostsNodeAggregationWhereInput = {
  AND?: Maybe<Array<TagPostsNodeAggregationWhereInput>>
  OR?: Maybe<Array<TagPostsNodeAggregationWhereInput>>
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
  text_EQUAL?: Maybe<Scalars['String']>
  text_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  text_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  text_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  text_GT?: Maybe<Scalars['Int']>
  text_AVERAGE_GT?: Maybe<Scalars['Float']>
  text_LONGEST_GT?: Maybe<Scalars['Int']>
  text_SHORTEST_GT?: Maybe<Scalars['Int']>
  text_GTE?: Maybe<Scalars['Int']>
  text_AVERAGE_GTE?: Maybe<Scalars['Float']>
  text_LONGEST_GTE?: Maybe<Scalars['Int']>
  text_SHORTEST_GTE?: Maybe<Scalars['Int']>
  text_LT?: Maybe<Scalars['Int']>
  text_AVERAGE_LT?: Maybe<Scalars['Float']>
  text_LONGEST_LT?: Maybe<Scalars['Int']>
  text_SHORTEST_LT?: Maybe<Scalars['Int']>
  text_LTE?: Maybe<Scalars['Int']>
  text_AVERAGE_LTE?: Maybe<Scalars['Float']>
  text_LONGEST_LTE?: Maybe<Scalars['Int']>
  text_SHORTEST_LTE?: Maybe<Scalars['Int']>
  viewsCount_EQUAL?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  viewsCount_MIN_EQUAL?: Maybe<Scalars['Int']>
  viewsCount_MAX_EQUAL?: Maybe<Scalars['Int']>
  viewsCount_SUM_EQUAL?: Maybe<Scalars['Int']>
  viewsCount_GT?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_GT?: Maybe<Scalars['Float']>
  viewsCount_MIN_GT?: Maybe<Scalars['Int']>
  viewsCount_MAX_GT?: Maybe<Scalars['Int']>
  viewsCount_SUM_GT?: Maybe<Scalars['Int']>
  viewsCount_GTE?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_GTE?: Maybe<Scalars['Float']>
  viewsCount_MIN_GTE?: Maybe<Scalars['Int']>
  viewsCount_MAX_GTE?: Maybe<Scalars['Int']>
  viewsCount_SUM_GTE?: Maybe<Scalars['Int']>
  viewsCount_LT?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_LT?: Maybe<Scalars['Float']>
  viewsCount_MIN_LT?: Maybe<Scalars['Int']>
  viewsCount_MAX_LT?: Maybe<Scalars['Int']>
  viewsCount_SUM_LT?: Maybe<Scalars['Int']>
  viewsCount_LTE?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_LTE?: Maybe<Scalars['Float']>
  viewsCount_MIN_LTE?: Maybe<Scalars['Int']>
  viewsCount_MAX_LTE?: Maybe<Scalars['Int']>
  viewsCount_SUM_LTE?: Maybe<Scalars['Int']>
  createdAt_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_MIN_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_MAX_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_GT?: Maybe<Scalars['DateTime']>
  createdAt_MIN_GT?: Maybe<Scalars['DateTime']>
  createdAt_MAX_GT?: Maybe<Scalars['DateTime']>
  createdAt_GTE?: Maybe<Scalars['DateTime']>
  createdAt_MIN_GTE?: Maybe<Scalars['DateTime']>
  createdAt_MAX_GTE?: Maybe<Scalars['DateTime']>
  createdAt_LT?: Maybe<Scalars['DateTime']>
  createdAt_MIN_LT?: Maybe<Scalars['DateTime']>
  createdAt_MAX_LT?: Maybe<Scalars['DateTime']>
  createdAt_LTE?: Maybe<Scalars['DateTime']>
  createdAt_MIN_LTE?: Maybe<Scalars['DateTime']>
  createdAt_MAX_LTE?: Maybe<Scalars['DateTime']>
}

export type TagPostsUpdateConnectionInput = {
  node?: Maybe<PostUpdateInput>
}

export type TagPostsUpdateFieldInput = {
  where?: Maybe<TagPostsConnectionWhere>
  update?: Maybe<TagPostsUpdateConnectionInput>
  connect?: Maybe<Array<TagPostsConnectFieldInput>>
  disconnect?: Maybe<Array<TagPostsDisconnectFieldInput>>
  create?: Maybe<Array<TagPostsCreateFieldInput>>
  delete?: Maybe<Array<TagPostsDeleteFieldInput>>
}

export type TagRelationInput = {
  author?: Maybe<TagAuthorCreateFieldInput>
  posts?: Maybe<Array<TagPostsCreateFieldInput>>
}

/** Fields to sort Tags by. The order in which sorts are applied is not guaranteed when specifying many fields in one TagSort object. */
export type TagSort = {
  id?: Maybe<SortDirection>
  text?: Maybe<SortDirection>
  createdAt?: Maybe<SortDirection>
}

export type TagUpdateInput = {
  id?: Maybe<Scalars['String']>
  text?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  author?: Maybe<TagAuthorUpdateFieldInput>
  posts?: Maybe<Array<TagPostsUpdateFieldInput>>
}

export type TagWhere = {
  OR?: Maybe<Array<TagWhere>>
  AND?: Maybe<Array<TagWhere>>
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
  text?: Maybe<Scalars['String']>
  text_NOT?: Maybe<Scalars['String']>
  text_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  text_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  text_CONTAINS?: Maybe<Scalars['String']>
  text_NOT_CONTAINS?: Maybe<Scalars['String']>
  text_STARTS_WITH?: Maybe<Scalars['String']>
  text_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  text_ENDS_WITH?: Maybe<Scalars['String']>
  text_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  createdAt_NOT?: Maybe<Scalars['DateTime']>
  createdAt_IN?: Maybe<Array<Maybe<Scalars['DateTime']>>>
  createdAt_NOT_IN?: Maybe<Array<Maybe<Scalars['DateTime']>>>
  createdAt_LT?: Maybe<Scalars['DateTime']>
  createdAt_LTE?: Maybe<Scalars['DateTime']>
  createdAt_GT?: Maybe<Scalars['DateTime']>
  createdAt_GTE?: Maybe<Scalars['DateTime']>
  author?: Maybe<UserWhere>
  author_NOT?: Maybe<UserWhere>
  authorAggregate?: Maybe<TagAuthorAggregateInput>
  posts?: Maybe<PostWhere>
  posts_NOT?: Maybe<PostWhere>
  postsAggregate?: Maybe<TagPostsAggregateInput>
  authorConnection?: Maybe<TagAuthorConnectionWhere>
  authorConnection_NOT?: Maybe<TagAuthorConnectionWhere>
  postsConnection?: Maybe<TagPostsConnectionWhere>
  postsConnection_NOT?: Maybe<TagPostsConnectionWhere>
}

export type TrainingConnectInput = {
  users?: Maybe<Array<TrainingUsersConnectFieldInput>>
}

export type TrainingConnectWhere = {
  node: TrainingWhere
}

export type TrainingCreateInput = {
  id: Scalars['ID']
  name: Scalars['String']
  users?: Maybe<TrainingUsersFieldInput>
}

export type TrainingDeleteInput = {
  users?: Maybe<Array<TrainingUsersDeleteFieldInput>>
}

export type TrainingDisconnectInput = {
  users?: Maybe<Array<TrainingUsersDisconnectFieldInput>>
}

export type TrainingOptions = {
  /** Specify one or more TrainingSort objects to sort Trainings by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: Maybe<Array<Maybe<TrainingSort>>>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
}

export type TrainingRelationInput = {
  users?: Maybe<Array<TrainingUsersCreateFieldInput>>
}

/** Fields to sort Trainings by. The order in which sorts are applied is not guaranteed when specifying many fields in one TrainingSort object. */
export type TrainingSort = {
  id?: Maybe<SortDirection>
  name?: Maybe<SortDirection>
}

export type TrainingUpdateInput = {
  id?: Maybe<Scalars['ID']>
  name?: Maybe<Scalars['String']>
  users?: Maybe<Array<TrainingUsersUpdateFieldInput>>
}

export type TrainingUsersAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<TrainingUsersAggregateInput>>
  OR?: Maybe<Array<TrainingUsersAggregateInput>>
  node?: Maybe<TrainingUsersNodeAggregationWhereInput>
}

export type TrainingUsersConnectFieldInput = {
  where?: Maybe<UserConnectWhere>
  connect?: Maybe<Array<UserConnectInput>>
}

export type TrainingUsersConnectionSort = {
  node?: Maybe<UserSort>
}

export type TrainingUsersConnectionWhere = {
  AND?: Maybe<Array<TrainingUsersConnectionWhere>>
  OR?: Maybe<Array<TrainingUsersConnectionWhere>>
  node?: Maybe<UserWhere>
  node_NOT?: Maybe<UserWhere>
}

export type TrainingUsersCreateFieldInput = {
  node: UserCreateInput
}

export type TrainingUsersDeleteFieldInput = {
  where?: Maybe<TrainingUsersConnectionWhere>
  delete?: Maybe<UserDeleteInput>
}

export type TrainingUsersDisconnectFieldInput = {
  where?: Maybe<TrainingUsersConnectionWhere>
  disconnect?: Maybe<UserDisconnectInput>
}

export type TrainingUsersFieldInput = {
  create?: Maybe<Array<TrainingUsersCreateFieldInput>>
  connect?: Maybe<Array<TrainingUsersConnectFieldInput>>
}

export type TrainingUsersNodeAggregationWhereInput = {
  AND?: Maybe<Array<TrainingUsersNodeAggregationWhereInput>>
  OR?: Maybe<Array<TrainingUsersNodeAggregationWhereInput>>
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

export type TrainingUsersUpdateConnectionInput = {
  node?: Maybe<UserUpdateInput>
}

export type TrainingUsersUpdateFieldInput = {
  where?: Maybe<TrainingUsersConnectionWhere>
  update?: Maybe<TrainingUsersUpdateConnectionInput>
  connect?: Maybe<Array<TrainingUsersConnectFieldInput>>
  disconnect?: Maybe<Array<TrainingUsersDisconnectFieldInput>>
  create?: Maybe<Array<TrainingUsersCreateFieldInput>>
  delete?: Maybe<Array<TrainingUsersDeleteFieldInput>>
}

export type TrainingWhere = {
  OR?: Maybe<Array<TrainingWhere>>
  AND?: Maybe<Array<TrainingWhere>>
  id?: Maybe<Scalars['ID']>
  id_NOT?: Maybe<Scalars['ID']>
  id_IN?: Maybe<Array<Maybe<Scalars['ID']>>>
  id_NOT_IN?: Maybe<Array<Maybe<Scalars['ID']>>>
  id_CONTAINS?: Maybe<Scalars['ID']>
  id_NOT_CONTAINS?: Maybe<Scalars['ID']>
  id_STARTS_WITH?: Maybe<Scalars['ID']>
  id_NOT_STARTS_WITH?: Maybe<Scalars['ID']>
  id_ENDS_WITH?: Maybe<Scalars['ID']>
  id_NOT_ENDS_WITH?: Maybe<Scalars['ID']>
  name?: Maybe<Scalars['String']>
  name_NOT?: Maybe<Scalars['String']>
  name_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  name_NOT_IN?: Maybe<Array<Maybe<Scalars['String']>>>
  name_CONTAINS?: Maybe<Scalars['String']>
  name_NOT_CONTAINS?: Maybe<Scalars['String']>
  name_STARTS_WITH?: Maybe<Scalars['String']>
  name_NOT_STARTS_WITH?: Maybe<Scalars['String']>
  name_ENDS_WITH?: Maybe<Scalars['String']>
  name_NOT_ENDS_WITH?: Maybe<Scalars['String']>
  users?: Maybe<UserWhere>
  users_NOT?: Maybe<UserWhere>
  usersAggregate?: Maybe<TrainingUsersAggregateInput>
  usersConnection?: Maybe<TrainingUsersConnectionWhere>
  usersConnection_NOT?: Maybe<TrainingUsersConnectionWhere>
}

export type UserConnectInput = {
  school?: Maybe<UserSchoolConnectFieldInput>
  training?: Maybe<UserTrainingConnectFieldInput>
  friends?: Maybe<Array<UserFriendsConnectFieldInput>>
  posts?: Maybe<Array<UserPostsConnectFieldInput>>
  tags?: Maybe<Array<UserTagsConnectFieldInput>>
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
  school?: Maybe<UserSchoolFieldInput>
  training?: Maybe<UserTrainingFieldInput>
  friends?: Maybe<UserFriendsFieldInput>
  posts?: Maybe<UserPostsFieldInput>
  tags?: Maybe<UserTagsFieldInput>
}

export type UserDeleteInput = {
  school?: Maybe<UserSchoolDeleteFieldInput>
  training?: Maybe<UserTrainingDeleteFieldInput>
  friends?: Maybe<Array<UserFriendsDeleteFieldInput>>
  posts?: Maybe<Array<UserPostsDeleteFieldInput>>
  tags?: Maybe<Array<UserTagsDeleteFieldInput>>
}

export type UserDisconnectInput = {
  school?: Maybe<UserSchoolDisconnectFieldInput>
  training?: Maybe<UserTrainingDisconnectFieldInput>
  friends?: Maybe<Array<UserFriendsDisconnectFieldInput>>
  posts?: Maybe<Array<UserPostsDisconnectFieldInput>>
  tags?: Maybe<Array<UserTagsDisconnectFieldInput>>
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

export type UserPostsAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<UserPostsAggregateInput>>
  OR?: Maybe<Array<UserPostsAggregateInput>>
  node?: Maybe<UserPostsNodeAggregationWhereInput>
}

export type UserPostsConnectFieldInput = {
  where?: Maybe<PostConnectWhere>
  connect?: Maybe<Array<PostConnectInput>>
}

export type UserPostsConnectionSort = {
  node?: Maybe<PostSort>
}

export type UserPostsConnectionWhere = {
  AND?: Maybe<Array<UserPostsConnectionWhere>>
  OR?: Maybe<Array<UserPostsConnectionWhere>>
  node?: Maybe<PostWhere>
  node_NOT?: Maybe<PostWhere>
}

export type UserPostsCreateFieldInput = {
  node: PostCreateInput
}

export type UserPostsDeleteFieldInput = {
  where?: Maybe<UserPostsConnectionWhere>
  delete?: Maybe<PostDeleteInput>
}

export type UserPostsDisconnectFieldInput = {
  where?: Maybe<UserPostsConnectionWhere>
  disconnect?: Maybe<PostDisconnectInput>
}

export type UserPostsFieldInput = {
  create?: Maybe<Array<UserPostsCreateFieldInput>>
  connect?: Maybe<Array<UserPostsConnectFieldInput>>
}

export type UserPostsNodeAggregationWhereInput = {
  AND?: Maybe<Array<UserPostsNodeAggregationWhereInput>>
  OR?: Maybe<Array<UserPostsNodeAggregationWhereInput>>
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
  text_EQUAL?: Maybe<Scalars['String']>
  text_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  text_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  text_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  text_GT?: Maybe<Scalars['Int']>
  text_AVERAGE_GT?: Maybe<Scalars['Float']>
  text_LONGEST_GT?: Maybe<Scalars['Int']>
  text_SHORTEST_GT?: Maybe<Scalars['Int']>
  text_GTE?: Maybe<Scalars['Int']>
  text_AVERAGE_GTE?: Maybe<Scalars['Float']>
  text_LONGEST_GTE?: Maybe<Scalars['Int']>
  text_SHORTEST_GTE?: Maybe<Scalars['Int']>
  text_LT?: Maybe<Scalars['Int']>
  text_AVERAGE_LT?: Maybe<Scalars['Float']>
  text_LONGEST_LT?: Maybe<Scalars['Int']>
  text_SHORTEST_LT?: Maybe<Scalars['Int']>
  text_LTE?: Maybe<Scalars['Int']>
  text_AVERAGE_LTE?: Maybe<Scalars['Float']>
  text_LONGEST_LTE?: Maybe<Scalars['Int']>
  text_SHORTEST_LTE?: Maybe<Scalars['Int']>
  viewsCount_EQUAL?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  viewsCount_MIN_EQUAL?: Maybe<Scalars['Int']>
  viewsCount_MAX_EQUAL?: Maybe<Scalars['Int']>
  viewsCount_SUM_EQUAL?: Maybe<Scalars['Int']>
  viewsCount_GT?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_GT?: Maybe<Scalars['Float']>
  viewsCount_MIN_GT?: Maybe<Scalars['Int']>
  viewsCount_MAX_GT?: Maybe<Scalars['Int']>
  viewsCount_SUM_GT?: Maybe<Scalars['Int']>
  viewsCount_GTE?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_GTE?: Maybe<Scalars['Float']>
  viewsCount_MIN_GTE?: Maybe<Scalars['Int']>
  viewsCount_MAX_GTE?: Maybe<Scalars['Int']>
  viewsCount_SUM_GTE?: Maybe<Scalars['Int']>
  viewsCount_LT?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_LT?: Maybe<Scalars['Float']>
  viewsCount_MIN_LT?: Maybe<Scalars['Int']>
  viewsCount_MAX_LT?: Maybe<Scalars['Int']>
  viewsCount_SUM_LT?: Maybe<Scalars['Int']>
  viewsCount_LTE?: Maybe<Scalars['Int']>
  viewsCount_AVERAGE_LTE?: Maybe<Scalars['Float']>
  viewsCount_MIN_LTE?: Maybe<Scalars['Int']>
  viewsCount_MAX_LTE?: Maybe<Scalars['Int']>
  viewsCount_SUM_LTE?: Maybe<Scalars['Int']>
  createdAt_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_MIN_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_MAX_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_GT?: Maybe<Scalars['DateTime']>
  createdAt_MIN_GT?: Maybe<Scalars['DateTime']>
  createdAt_MAX_GT?: Maybe<Scalars['DateTime']>
  createdAt_GTE?: Maybe<Scalars['DateTime']>
  createdAt_MIN_GTE?: Maybe<Scalars['DateTime']>
  createdAt_MAX_GTE?: Maybe<Scalars['DateTime']>
  createdAt_LT?: Maybe<Scalars['DateTime']>
  createdAt_MIN_LT?: Maybe<Scalars['DateTime']>
  createdAt_MAX_LT?: Maybe<Scalars['DateTime']>
  createdAt_LTE?: Maybe<Scalars['DateTime']>
  createdAt_MIN_LTE?: Maybe<Scalars['DateTime']>
  createdAt_MAX_LTE?: Maybe<Scalars['DateTime']>
}

export type UserPostsUpdateConnectionInput = {
  node?: Maybe<PostUpdateInput>
}

export type UserPostsUpdateFieldInput = {
  where?: Maybe<UserPostsConnectionWhere>
  update?: Maybe<UserPostsUpdateConnectionInput>
  connect?: Maybe<Array<UserPostsConnectFieldInput>>
  disconnect?: Maybe<Array<UserPostsDisconnectFieldInput>>
  create?: Maybe<Array<UserPostsCreateFieldInput>>
  delete?: Maybe<Array<UserPostsDeleteFieldInput>>
}

export type UserRelationInput = {
  school?: Maybe<UserSchoolCreateFieldInput>
  training?: Maybe<UserTrainingCreateFieldInput>
  friends?: Maybe<Array<UserFriendsCreateFieldInput>>
  posts?: Maybe<Array<UserPostsCreateFieldInput>>
  tags?: Maybe<Array<UserTagsCreateFieldInput>>
}

export type UserSchoolAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<UserSchoolAggregateInput>>
  OR?: Maybe<Array<UserSchoolAggregateInput>>
  node?: Maybe<UserSchoolNodeAggregationWhereInput>
}

export type UserSchoolConnectFieldInput = {
  where?: Maybe<SchoolConnectWhere>
  connect?: Maybe<SchoolConnectInput>
}

export type UserSchoolConnectionSort = {
  node?: Maybe<SchoolSort>
}

export type UserSchoolConnectionWhere = {
  AND?: Maybe<Array<UserSchoolConnectionWhere>>
  OR?: Maybe<Array<UserSchoolConnectionWhere>>
  node?: Maybe<SchoolWhere>
  node_NOT?: Maybe<SchoolWhere>
}

export type UserSchoolCreateFieldInput = {
  node: SchoolCreateInput
}

export type UserSchoolDeleteFieldInput = {
  where?: Maybe<UserSchoolConnectionWhere>
  delete?: Maybe<SchoolDeleteInput>
}

export type UserSchoolDisconnectFieldInput = {
  where?: Maybe<UserSchoolConnectionWhere>
  disconnect?: Maybe<SchoolDisconnectInput>
}

export type UserSchoolFieldInput = {
  create?: Maybe<UserSchoolCreateFieldInput>
  connect?: Maybe<UserSchoolConnectFieldInput>
}

export type UserSchoolNodeAggregationWhereInput = {
  AND?: Maybe<Array<UserSchoolNodeAggregationWhereInput>>
  OR?: Maybe<Array<UserSchoolNodeAggregationWhereInput>>
  id_EQUAL?: Maybe<Scalars['ID']>
  googlePlaceId_EQUAL?: Maybe<Scalars['String']>
  googlePlaceId_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  googlePlaceId_GT?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_GT?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_GT?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_GT?: Maybe<Scalars['Int']>
  googlePlaceId_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_GTE?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_GTE?: Maybe<Scalars['Int']>
  googlePlaceId_LT?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_LT?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_LT?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_LT?: Maybe<Scalars['Int']>
  googlePlaceId_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_AVERAGE_LTE?: Maybe<Scalars['Float']>
  googlePlaceId_LONGEST_LTE?: Maybe<Scalars['Int']>
  googlePlaceId_SHORTEST_LTE?: Maybe<Scalars['Int']>
  name_EQUAL?: Maybe<Scalars['String']>
  name_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  name_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  name_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  name_GT?: Maybe<Scalars['Int']>
  name_AVERAGE_GT?: Maybe<Scalars['Float']>
  name_LONGEST_GT?: Maybe<Scalars['Int']>
  name_SHORTEST_GT?: Maybe<Scalars['Int']>
  name_GTE?: Maybe<Scalars['Int']>
  name_AVERAGE_GTE?: Maybe<Scalars['Float']>
  name_LONGEST_GTE?: Maybe<Scalars['Int']>
  name_SHORTEST_GTE?: Maybe<Scalars['Int']>
  name_LT?: Maybe<Scalars['Int']>
  name_AVERAGE_LT?: Maybe<Scalars['Float']>
  name_LONGEST_LT?: Maybe<Scalars['Int']>
  name_SHORTEST_LT?: Maybe<Scalars['Int']>
  name_LTE?: Maybe<Scalars['Int']>
  name_AVERAGE_LTE?: Maybe<Scalars['Float']>
  name_LONGEST_LTE?: Maybe<Scalars['Int']>
  name_SHORTEST_LTE?: Maybe<Scalars['Int']>
  lat_EQUAL?: Maybe<Scalars['Float']>
  lat_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lat_MIN_EQUAL?: Maybe<Scalars['Float']>
  lat_MAX_EQUAL?: Maybe<Scalars['Float']>
  lat_SUM_EQUAL?: Maybe<Scalars['Float']>
  lat_GT?: Maybe<Scalars['Float']>
  lat_AVERAGE_GT?: Maybe<Scalars['Float']>
  lat_MIN_GT?: Maybe<Scalars['Float']>
  lat_MAX_GT?: Maybe<Scalars['Float']>
  lat_SUM_GT?: Maybe<Scalars['Float']>
  lat_GTE?: Maybe<Scalars['Float']>
  lat_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lat_MIN_GTE?: Maybe<Scalars['Float']>
  lat_MAX_GTE?: Maybe<Scalars['Float']>
  lat_SUM_GTE?: Maybe<Scalars['Float']>
  lat_LT?: Maybe<Scalars['Float']>
  lat_AVERAGE_LT?: Maybe<Scalars['Float']>
  lat_MIN_LT?: Maybe<Scalars['Float']>
  lat_MAX_LT?: Maybe<Scalars['Float']>
  lat_SUM_LT?: Maybe<Scalars['Float']>
  lat_LTE?: Maybe<Scalars['Float']>
  lat_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lat_MIN_LTE?: Maybe<Scalars['Float']>
  lat_MAX_LTE?: Maybe<Scalars['Float']>
  lat_SUM_LTE?: Maybe<Scalars['Float']>
  lng_EQUAL?: Maybe<Scalars['Float']>
  lng_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  lng_MIN_EQUAL?: Maybe<Scalars['Float']>
  lng_MAX_EQUAL?: Maybe<Scalars['Float']>
  lng_SUM_EQUAL?: Maybe<Scalars['Float']>
  lng_GT?: Maybe<Scalars['Float']>
  lng_AVERAGE_GT?: Maybe<Scalars['Float']>
  lng_MIN_GT?: Maybe<Scalars['Float']>
  lng_MAX_GT?: Maybe<Scalars['Float']>
  lng_SUM_GT?: Maybe<Scalars['Float']>
  lng_GTE?: Maybe<Scalars['Float']>
  lng_AVERAGE_GTE?: Maybe<Scalars['Float']>
  lng_MIN_GTE?: Maybe<Scalars['Float']>
  lng_MAX_GTE?: Maybe<Scalars['Float']>
  lng_SUM_GTE?: Maybe<Scalars['Float']>
  lng_LT?: Maybe<Scalars['Float']>
  lng_AVERAGE_LT?: Maybe<Scalars['Float']>
  lng_MIN_LT?: Maybe<Scalars['Float']>
  lng_MAX_LT?: Maybe<Scalars['Float']>
  lng_SUM_LT?: Maybe<Scalars['Float']>
  lng_LTE?: Maybe<Scalars['Float']>
  lng_AVERAGE_LTE?: Maybe<Scalars['Float']>
  lng_MIN_LTE?: Maybe<Scalars['Float']>
  lng_MAX_LTE?: Maybe<Scalars['Float']>
  lng_SUM_LTE?: Maybe<Scalars['Float']>
}

export type UserSchoolUpdateConnectionInput = {
  node?: Maybe<SchoolUpdateInput>
}

export type UserSchoolUpdateFieldInput = {
  where?: Maybe<UserSchoolConnectionWhere>
  update?: Maybe<UserSchoolUpdateConnectionInput>
  connect?: Maybe<UserSchoolConnectFieldInput>
  disconnect?: Maybe<UserSchoolDisconnectFieldInput>
  create?: Maybe<UserSchoolCreateFieldInput>
  delete?: Maybe<UserSchoolDeleteFieldInput>
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

export type UserTagsAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<UserTagsAggregateInput>>
  OR?: Maybe<Array<UserTagsAggregateInput>>
  node?: Maybe<UserTagsNodeAggregationWhereInput>
}

export type UserTagsConnectFieldInput = {
  where?: Maybe<TagConnectWhere>
  connect?: Maybe<Array<TagConnectInput>>
}

export type UserTagsConnectionSort = {
  node?: Maybe<TagSort>
}

export type UserTagsConnectionWhere = {
  AND?: Maybe<Array<UserTagsConnectionWhere>>
  OR?: Maybe<Array<UserTagsConnectionWhere>>
  node?: Maybe<TagWhere>
  node_NOT?: Maybe<TagWhere>
}

export type UserTagsCreateFieldInput = {
  node: TagCreateInput
}

export type UserTagsDeleteFieldInput = {
  where?: Maybe<UserTagsConnectionWhere>
  delete?: Maybe<TagDeleteInput>
}

export type UserTagsDisconnectFieldInput = {
  where?: Maybe<UserTagsConnectionWhere>
  disconnect?: Maybe<TagDisconnectInput>
}

export type UserTagsFieldInput = {
  create?: Maybe<Array<UserTagsCreateFieldInput>>
  connect?: Maybe<Array<UserTagsConnectFieldInput>>
}

export type UserTagsNodeAggregationWhereInput = {
  AND?: Maybe<Array<UserTagsNodeAggregationWhereInput>>
  OR?: Maybe<Array<UserTagsNodeAggregationWhereInput>>
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
  text_EQUAL?: Maybe<Scalars['String']>
  text_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  text_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  text_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  text_GT?: Maybe<Scalars['Int']>
  text_AVERAGE_GT?: Maybe<Scalars['Float']>
  text_LONGEST_GT?: Maybe<Scalars['Int']>
  text_SHORTEST_GT?: Maybe<Scalars['Int']>
  text_GTE?: Maybe<Scalars['Int']>
  text_AVERAGE_GTE?: Maybe<Scalars['Float']>
  text_LONGEST_GTE?: Maybe<Scalars['Int']>
  text_SHORTEST_GTE?: Maybe<Scalars['Int']>
  text_LT?: Maybe<Scalars['Int']>
  text_AVERAGE_LT?: Maybe<Scalars['Float']>
  text_LONGEST_LT?: Maybe<Scalars['Int']>
  text_SHORTEST_LT?: Maybe<Scalars['Int']>
  text_LTE?: Maybe<Scalars['Int']>
  text_AVERAGE_LTE?: Maybe<Scalars['Float']>
  text_LONGEST_LTE?: Maybe<Scalars['Int']>
  text_SHORTEST_LTE?: Maybe<Scalars['Int']>
  createdAt_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_MIN_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_MAX_EQUAL?: Maybe<Scalars['DateTime']>
  createdAt_GT?: Maybe<Scalars['DateTime']>
  createdAt_MIN_GT?: Maybe<Scalars['DateTime']>
  createdAt_MAX_GT?: Maybe<Scalars['DateTime']>
  createdAt_GTE?: Maybe<Scalars['DateTime']>
  createdAt_MIN_GTE?: Maybe<Scalars['DateTime']>
  createdAt_MAX_GTE?: Maybe<Scalars['DateTime']>
  createdAt_LT?: Maybe<Scalars['DateTime']>
  createdAt_MIN_LT?: Maybe<Scalars['DateTime']>
  createdAt_MAX_LT?: Maybe<Scalars['DateTime']>
  createdAt_LTE?: Maybe<Scalars['DateTime']>
  createdAt_MIN_LTE?: Maybe<Scalars['DateTime']>
  createdAt_MAX_LTE?: Maybe<Scalars['DateTime']>
}

export type UserTagsUpdateConnectionInput = {
  node?: Maybe<TagUpdateInput>
}

export type UserTagsUpdateFieldInput = {
  where?: Maybe<UserTagsConnectionWhere>
  update?: Maybe<UserTagsUpdateConnectionInput>
  connect?: Maybe<Array<UserTagsConnectFieldInput>>
  disconnect?: Maybe<Array<UserTagsDisconnectFieldInput>>
  create?: Maybe<Array<UserTagsCreateFieldInput>>
  delete?: Maybe<Array<UserTagsDeleteFieldInput>>
}

export type UserTrainingAggregateInput = {
  count?: Maybe<Scalars['Int']>
  count_LT?: Maybe<Scalars['Int']>
  count_LTE?: Maybe<Scalars['Int']>
  count_GT?: Maybe<Scalars['Int']>
  count_GTE?: Maybe<Scalars['Int']>
  AND?: Maybe<Array<UserTrainingAggregateInput>>
  OR?: Maybe<Array<UserTrainingAggregateInput>>
  node?: Maybe<UserTrainingNodeAggregationWhereInput>
}

export type UserTrainingConnectFieldInput = {
  where?: Maybe<TrainingConnectWhere>
  connect?: Maybe<TrainingConnectInput>
}

export type UserTrainingConnectionSort = {
  node?: Maybe<TrainingSort>
}

export type UserTrainingConnectionWhere = {
  AND?: Maybe<Array<UserTrainingConnectionWhere>>
  OR?: Maybe<Array<UserTrainingConnectionWhere>>
  node?: Maybe<TrainingWhere>
  node_NOT?: Maybe<TrainingWhere>
}

export type UserTrainingCreateFieldInput = {
  node: TrainingCreateInput
}

export type UserTrainingDeleteFieldInput = {
  where?: Maybe<UserTrainingConnectionWhere>
  delete?: Maybe<TrainingDeleteInput>
}

export type UserTrainingDisconnectFieldInput = {
  where?: Maybe<UserTrainingConnectionWhere>
  disconnect?: Maybe<TrainingDisconnectInput>
}

export type UserTrainingFieldInput = {
  create?: Maybe<UserTrainingCreateFieldInput>
  connect?: Maybe<UserTrainingConnectFieldInput>
}

export type UserTrainingNodeAggregationWhereInput = {
  AND?: Maybe<Array<UserTrainingNodeAggregationWhereInput>>
  OR?: Maybe<Array<UserTrainingNodeAggregationWhereInput>>
  id_EQUAL?: Maybe<Scalars['ID']>
  name_EQUAL?: Maybe<Scalars['String']>
  name_AVERAGE_EQUAL?: Maybe<Scalars['Float']>
  name_LONGEST_EQUAL?: Maybe<Scalars['Int']>
  name_SHORTEST_EQUAL?: Maybe<Scalars['Int']>
  name_GT?: Maybe<Scalars['Int']>
  name_AVERAGE_GT?: Maybe<Scalars['Float']>
  name_LONGEST_GT?: Maybe<Scalars['Int']>
  name_SHORTEST_GT?: Maybe<Scalars['Int']>
  name_GTE?: Maybe<Scalars['Int']>
  name_AVERAGE_GTE?: Maybe<Scalars['Float']>
  name_LONGEST_GTE?: Maybe<Scalars['Int']>
  name_SHORTEST_GTE?: Maybe<Scalars['Int']>
  name_LT?: Maybe<Scalars['Int']>
  name_AVERAGE_LT?: Maybe<Scalars['Float']>
  name_LONGEST_LT?: Maybe<Scalars['Int']>
  name_SHORTEST_LT?: Maybe<Scalars['Int']>
  name_LTE?: Maybe<Scalars['Int']>
  name_AVERAGE_LTE?: Maybe<Scalars['Float']>
  name_LONGEST_LTE?: Maybe<Scalars['Int']>
  name_SHORTEST_LTE?: Maybe<Scalars['Int']>
}

export type UserTrainingUpdateConnectionInput = {
  node?: Maybe<TrainingUpdateInput>
}

export type UserTrainingUpdateFieldInput = {
  where?: Maybe<UserTrainingConnectionWhere>
  update?: Maybe<UserTrainingUpdateConnectionInput>
  connect?: Maybe<UserTrainingConnectFieldInput>
  disconnect?: Maybe<UserTrainingDisconnectFieldInput>
  create?: Maybe<UserTrainingCreateFieldInput>
  delete?: Maybe<UserTrainingDeleteFieldInput>
}

export type UserUpdateInput = {
  id?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  pictureId?: Maybe<Scalars['String']>
  about?: Maybe<Scalars['String']>
  instagram?: Maybe<Scalars['String']>
  snapchat?: Maybe<Scalars['String']>
  school?: Maybe<UserSchoolUpdateFieldInput>
  training?: Maybe<UserTrainingUpdateFieldInput>
  friends?: Maybe<Array<UserFriendsUpdateFieldInput>>
  posts?: Maybe<Array<UserPostsUpdateFieldInput>>
  tags?: Maybe<Array<UserTagsUpdateFieldInput>>
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
  school?: Maybe<SchoolWhere>
  school_NOT?: Maybe<SchoolWhere>
  schoolAggregate?: Maybe<UserSchoolAggregateInput>
  training?: Maybe<TrainingWhere>
  training_NOT?: Maybe<TrainingWhere>
  trainingAggregate?: Maybe<UserTrainingAggregateInput>
  friends?: Maybe<UserWhere>
  friends_NOT?: Maybe<UserWhere>
  friendsAggregate?: Maybe<UserFriendsAggregateInput>
  posts?: Maybe<PostWhere>
  posts_NOT?: Maybe<PostWhere>
  postsAggregate?: Maybe<UserPostsAggregateInput>
  tags?: Maybe<TagWhere>
  tags_NOT?: Maybe<TagWhere>
  tagsAggregate?: Maybe<UserTagsAggregateInput>
  schoolConnection?: Maybe<UserSchoolConnectionWhere>
  schoolConnection_NOT?: Maybe<UserSchoolConnectionWhere>
  trainingConnection?: Maybe<UserTrainingConnectionWhere>
  trainingConnection_NOT?: Maybe<UserTrainingConnectionWhere>
  friendsConnection?: Maybe<UserFriendsConnectionWhere>
  friendsConnection_NOT?: Maybe<UserFriendsConnectionWhere>
  postsConnection?: Maybe<UserPostsConnectionWhere>
  postsConnection_NOT?: Maybe<UserPostsConnectionWhere>
  tagsConnection?: Maybe<UserTagsConnectionWhere>
  tagsConnection_NOT?: Maybe<UserTagsConnectionWhere>
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

export interface StringAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface IdAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface TrainingAggregateInput {
  count?: boolean
  id?: IdAggregateInput
  name?: StringAggregateInput
}

export declare class TrainingModel {
  public find(args?: {
    where?: TrainingWhere

    options?: TrainingOptions
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<Training[]>
  public count(args?: { where?: TrainingWhere }): Promise<number>
  public create(args: {
    input: TrainingCreateInput[]
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<CreateTrainingsMutationResponse>
  public update(args: {
    where?: TrainingWhere
    update?: TrainingUpdateInput
    connect?: TrainingConnectInput
    disconnect?: TrainingDisconnectInput
    create?: TrainingCreateInput

    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<UpdateTrainingsMutationResponse>
  public delete(args: {
    where?: TrainingWhere
    delete?: TrainingDeleteInput
    context?: any
    rootValue: any
  }): Promise<{ nodesDeleted: number; relationshipsDeleted: number }>
  public aggregate(args: {
    where?: TrainingWhere

    aggregate: TrainingAggregateInput
    context?: any
    rootValue?: any
  }): Promise<TrainingAggregateSelection>
}

export interface StringAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface IdAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface CountryAggregateInput {
  count?: boolean
  id?: IdAggregateInput
  name?: StringAggregateInput
}

export declare class CountryModel {
  public find(args?: {
    where?: CountryWhere

    options?: CountryOptions
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<Country[]>
  public count(args?: { where?: CountryWhere }): Promise<number>
  public create(args: {
    input: CountryCreateInput[]
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<CreateCountriesMutationResponse>
  public update(args: {
    where?: CountryWhere
    update?: CountryUpdateInput
    connect?: CountryConnectInput
    disconnect?: CountryDisconnectInput
    create?: CountryCreateInput

    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<UpdateCountriesMutationResponse>
  public delete(args: {
    where?: CountryWhere
    delete?: CountryDeleteInput
    context?: any
    rootValue: any
  }): Promise<{ nodesDeleted: number; relationshipsDeleted: number }>
  public aggregate(args: {
    where?: CountryWhere

    aggregate: CountryAggregateInput
    context?: any
    rootValue?: any
  }): Promise<CountryAggregateSelection>
}

export interface StringAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface IdAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface FloatAggregateInput {
  max?: boolean
  min?: boolean
  average?: boolean
  sum?: boolean
}
export interface CityAggregateInput {
  count?: boolean
  id?: IdAggregateInput
  name?: StringAggregateInput
  googlePlaceId?: StringAggregateInput
  lat?: FloatAggregateInput
  lng?: FloatAggregateInput
}

export declare class CityModel {
  public find(args?: {
    where?: CityWhere

    options?: CityOptions
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<City[]>
  public count(args?: { where?: CityWhere }): Promise<number>
  public create(args: {
    input: CityCreateInput[]
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<CreateCitiesMutationResponse>
  public update(args: {
    where?: CityWhere
    update?: CityUpdateInput
    connect?: CityConnectInput
    disconnect?: CityDisconnectInput
    create?: CityCreateInput

    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<UpdateCitiesMutationResponse>
  public delete(args: {
    where?: CityWhere
    delete?: CityDeleteInput
    context?: any
    rootValue: any
  }): Promise<{ nodesDeleted: number; relationshipsDeleted: number }>
  public aggregate(args: {
    where?: CityWhere

    aggregate: CityAggregateInput
    context?: any
    rootValue?: any
  }): Promise<CityAggregateSelection>
}

export interface StringAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface IdAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface FloatAggregateInput {
  max?: boolean
  min?: boolean
  average?: boolean
  sum?: boolean
}
export interface SchoolAggregateInput {
  count?: boolean
  googlePlaceId?: StringAggregateInput
  id?: IdAggregateInput
  lat?: FloatAggregateInput
  lng?: FloatAggregateInput
  name?: StringAggregateInput
}

export declare class SchoolModel {
  public find(args?: {
    where?: SchoolWhere

    options?: SchoolOptions
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<School[]>
  public count(args?: { where?: SchoolWhere }): Promise<number>
  public create(args: {
    input: SchoolCreateInput[]
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<CreateSchoolsMutationResponse>
  public update(args: {
    where?: SchoolWhere
    update?: SchoolUpdateInput
    connect?: SchoolConnectInput
    disconnect?: SchoolDisconnectInput
    create?: SchoolCreateInput

    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<UpdateSchoolsMutationResponse>
  public delete(args: {
    where?: SchoolWhere
    delete?: SchoolDeleteInput
    context?: any
    rootValue: any
  }): Promise<{ nodesDeleted: number; relationshipsDeleted: number }>
  public aggregate(args: {
    where?: SchoolWhere

    aggregate: SchoolAggregateInput
    context?: any
    rootValue?: any
  }): Promise<SchoolAggregateSelection>
}

export interface StringAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface IdAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface FloatAggregateInput {
  max?: boolean
  min?: boolean
  average?: boolean
  sum?: boolean
}
export interface DateTimeAggregateInput {
  min?: boolean
  max?: boolean
}
export interface TagAggregateInput {
  count?: boolean
  id?: StringAggregateInput
  text?: StringAggregateInput
  createdAt?: DateTimeAggregateInput
}

export declare class TagModel {
  public find(args?: {
    where?: TagWhere

    options?: TagOptions
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<Tag[]>
  public count(args?: { where?: TagWhere }): Promise<number>
  public create(args: {
    input: TagCreateInput[]
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<CreateTagsMutationResponse>
  public update(args: {
    where?: TagWhere
    update?: TagUpdateInput
    connect?: TagConnectInput
    disconnect?: TagDisconnectInput
    create?: TagCreateInput

    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<UpdateTagsMutationResponse>
  public delete(args: {
    where?: TagWhere
    delete?: TagDeleteInput
    context?: any
    rootValue: any
  }): Promise<{ nodesDeleted: number; relationshipsDeleted: number }>
  public aggregate(args: {
    where?: TagWhere

    aggregate: TagAggregateInput
    context?: any
    rootValue?: any
  }): Promise<TagAggregateSelection>
}

export interface StringAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface IdAggregateInput {
  shortest?: boolean
  longest?: boolean
}
export interface FloatAggregateInput {
  max?: boolean
  min?: boolean
  average?: boolean
  sum?: boolean
}
export interface DateTimeAggregateInput {
  min?: boolean
  max?: boolean
}
export interface IntAggregateInput {
  max?: boolean
  min?: boolean
  average?: boolean
  sum?: boolean
}
export interface PostAggregateInput {
  count?: boolean
  id?: StringAggregateInput
  text?: StringAggregateInput
  viewsCount?: IntAggregateInput
  createdAt?: DateTimeAggregateInput
}

export declare class PostModel {
  public find(args?: {
    where?: PostWhere

    options?: PostOptions
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<Post[]>
  public count(args?: { where?: PostWhere }): Promise<number>
  public create(args: {
    input: PostCreateInput[]
    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<CreatePostsMutationResponse>
  public update(args: {
    where?: PostWhere
    update?: PostUpdateInput
    connect?: PostConnectInput
    disconnect?: PostDisconnectInput
    create?: PostCreateInput

    selectionSet?: string | DocumentNode | SelectionSetNode
    args?: any
    context?: any
    rootValue?: any
  }): Promise<UpdatePostsMutationResponse>
  public delete(args: {
    where?: PostWhere
    delete?: PostDeleteInput
    context?: any
    rootValue: any
  }): Promise<{ nodesDeleted: number; relationshipsDeleted: number }>
  public aggregate(args: {
    where?: PostWhere

    aggregate: PostAggregateInput
    context?: any
    rootValue?: any
  }): Promise<PostAggregateSelection>
}

export interface ModelMap {
  User: UserModel
  Training: TrainingModel
  Country: CountryModel
  City: CityModel
  School: SchoolModel
  Tag: TagModel
  Post: PostModel
}
