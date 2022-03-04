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
    # birthdate: DateTime
    # school: School @relationship (type: "HAS_SCHOOL", direction: OUT)
    # training: Training @relationship (type: "HAS_TRAINING", direction: OUT)
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
`

// type Training {
//   id: String!
//   name: String!
// }

// type City {
//   id: String!
//   country: Country
//   googlePlaceId: String
//   name: String!
//   geolocation: Point
// }

// type Country {
//   id: String!
//   name: String!
// }

// type School {
//   id: String!
//   city: City
//   googlePlaceId: String
//   name: String
//   users: [User!]
//   geolocation: Point
// }

// type Tag {
//   id: String!
//   author: User! @relationship(type: "CREATES_TAG", direction: IN)
//   createdAt: DateTime
//   isLive: Boolean!
//   text: String!
// }

// type Post {
//   id: String!
//   author: User! @relationship(type: "HAS_POST", direction: IN)
//   createdAt: DateTime!
//   tags: [Tag!]!
//   text: String!
// }

export const { schema } = new Neo4jGraphQL({ typeDefs })

export const generate = async () => {
  const ogm = new OGM<ModelMap>({ typeDefs })

  await gen({
    ogm,
    outFile: 'src/generated/ogm-types.ts',
  })
}
