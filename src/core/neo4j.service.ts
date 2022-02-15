import { Injectable, OnModuleInit } from '@nestjs/common'
import { Driver } from 'neo4j-driver'
import { OGM } from '@neo4j/graphql-ogm'
import { ModelMap } from '../generated/ogm-types'
import { createDriver } from 'src/neo/createDriver'
import { typeDefs } from 'src/neo'

@Injectable()
export class Neo4jService implements OnModuleInit {
  config: any
  driver: Driver
  ogm: OGM<ModelMap>

  async onModuleInit(): Promise<void> {
    try {
      this.driver = await createDriver({
        uri: process.env.NEO4J_URI,
        user: process.env.NEO4J_USER,
        password: process.env.NEO4J_PASSWORD,
      })
    } catch (error) {
      console.error("Couldn't connect to server at " + process.env.NEO4J_URI)
    }

    this.ogm = new OGM<ModelMap>({
      typeDefs,
      driver: this.driver,
    })
  }
}
