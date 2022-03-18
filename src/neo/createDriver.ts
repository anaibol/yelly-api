import neo4j from 'neo4j-driver'

type Neo4jConfig = {
  uri: string
  user: string
  password: string
}

export const createDriver = async (config: Neo4jConfig) => {
  // Create a Driver instance
  const driver = neo4j.driver(`${config.uri}`, neo4j.auth.basic(config.user, config.password), {
    // disableLosslessIntegers: true,
  })
  // Verify the connection details or throw an Error
  // eslint-disable-next-line functional/no-expression-statement
  await driver.verifyConnectivity()
  // If everything is OK, return the driver
  return driver
}
