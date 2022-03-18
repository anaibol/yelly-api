import { ApolloServer } from 'apollo-server'
import { Neo4jGraphQL } from '@neo4j/graphql'

import 'dotenv/config'

import { createDriver } from './createDriver'
import { typeDefs } from 'src/neo'

const init = async () => {
  const driver = await createDriver({
    uri: process.env.NEO4J_URI,
    user: process.env.NEO4J_USER,
    password: process.env.NEO4J_PASSWORD,
  })

  const { schema } = new Neo4jGraphQL({ typeDefs, driver })

  const server = new ApolloServer({
    schema,
  })

  // eslint-disable-next-line functional/no-return-void
  server.listen().then(({ url }) => console.log(`Neo4j GraphQL server ready on ${url}`))
}

init()
