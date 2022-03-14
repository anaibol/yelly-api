import { OGM } from '@neo4j/graphql-ogm'
import 'dotenv/config'
import { Driver } from 'neo4j-driver'
import {
  CityModel,
  CountryModel,
  ModelMap,
  PostModel,
  SchoolModel,
  TagModel,
  TrainingModel,
  UserModel,
} from 'src/generated/ogm-types'
import { typeDefs } from 'src/neo'
import { createDriver } from 'src/neo/createDriver'

type GetNeo = {
  ogm: OGM<ModelMap>
  driver: Driver
  ogmUser: UserModel
  ogmPost: PostModel
  ogmTag: TagModel
  ogmSchool: SchoolModel
  ogmCity: CityModel
  ogmCountry: CountryModel
  ogmTraining: TrainingModel
}

export default async function getNeo(): Promise<GetNeo> {
  const driver = await createDriver({
    uri: process.env.NEO4J_URI,
    user: process.env.NEO4J_USER,
    password: process.env.NEO4J_PASSWORD,
  })

  const ogm = new OGM<ModelMap>({
    typeDefs,
    driver: driver,
  })
  const ogmUser = ogm.model('User')
  const ogmPost = ogm.model('Post')
  const ogmTag = ogm.model('Tag')
  const ogmSchool = ogm.model('School')
  const ogmCity = ogm.model('City')
  const ogmCountry = ogm.model('Country')
  const ogmTraining = ogm.model('Training')

  return {
    ogm,
    driver,
    ogmUser,
    ogmPost,
    ogmTag,
    ogmSchool,
    ogmCity,
    ogmCountry,
    ogmTraining,
  }
}
