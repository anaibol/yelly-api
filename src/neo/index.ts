import { Neo4jGraphQL } from '@neo4j/graphql'
import { ModelMap } from 'src/generated/ogm-types'
import { generate as gen, OGM } from '@neo4j/graphql-ogm'

import 'dotenv/config'

export const typeDefs = `
  type User {
    id: String!
    firstName: String
    lastName: String
    pictureId: String
    about: String
    instagram: String
    snapchat: String
    birthdate: DateTime
    school: School @relationship (type: "HAS_SCHOOL", direction: OUT)
    training: Training @relationship (type: "HAS_TRAINING", direction: OUT)
    friends: [User] @relationship (type: "IS_FRIEND", direction: OUT)
    posts: [Post!]! @relationship(type: "HAS_POST", direction: OUT)
    tags: [Tag!]! @relationship(type: "CREATES_TAG", direction: OUT)
    # recommended(first: Int = 3): [Session] @cypher(statement: """ MATCH (this)-[:HAS_THEMEI:IN_TRACK]-“)*-[:HAS_THEMEI:IN_TRACK]-(rec:Session) RETURN rec ORDER by rec DESC LIMIT $first""")
  }

  type Tag {
    id: String!
    author: User! @relationship(type: "CREATES_TAG", direction: IN)
    createdAt: DateTime
    text: String!
    posts: [Post!]! @relationship(type: "HAS_POST", direction: OUT)
  }

  type Post {
    id: String!
    author: User! @relationship(type: "HAS_POST", direction: IN)
    createdAt: DateTime
    tags: [Tag!]!  @relationship(type: "HAS_POST", direction: IN)
    text: String!
    viewsCount: Int!
  }

  type Training {
    id: ID!
    name: String!
    users: [User!] @relationship(type: "HAS_TRAINING", direction: IN)
  }

  type Country {
    id: ID!
    code: String!
    cities: [City!] @relationship(type: "HAS_CITY", direction: IN)
  }
  
  type City {
    id: ID!
    name: String  
    googlePlaceId: String
    lat: Float
    lng: Float
    schools: [School!] @relationship(type: "HAS_SCHOOL", direction: IN)
    country: Country @relationship(type: "HAS_CITY", direction: OUT)
  }

  type School {
    city: City @relationship(type: "HAS_SCHOOL", direction: OUT)
    googlePlaceId: String
    id: ID!
    lat: Float
    lng: Float
    name: String
    users: [User!] @relationship(type: "HAS_SCHOOL", direction: IN)
  }
`

export const { schema } = new Neo4jGraphQL({ typeDefs })

export const generate = async () => {
  const ogm = new OGM<ModelMap>({ typeDefs })

  await gen({
    ogm,
    outFile: 'src/generated/ogm-types.ts',
  })
}
