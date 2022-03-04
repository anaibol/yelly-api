import { createDriver } from '../../src/neo/createDriver'
import 'dotenv/config'

async function main() {
  const neoUri = process.env.NEO4J_URI as string
  const neoUser = process.env.NEO4J_USER as string
  const neoPassword = process.env.NEO4J_PASSWORD as string

  const driver = await createDriver({
    uri: neoUri,
    user: neoUser,
    password: neoPassword,
  })

  const session = driver.session()
  const lastName = 'Duval'

  try {
    const result = await session.run(
      "LOAD CSV WITH HEADERS FROM 'file:///user.csv' AS line CREATE (:User { id: line.id, firstName: line.firstName, lastName: line.lastName, pictureId: line.pictureId})"
    )
  } finally {
    await session.close()
  }

  // on application exit:
  await driver.close()
}

main()
