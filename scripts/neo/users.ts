import getNeo from './ogm'

async function main() {
  const { driver } = await getNeo()

  const session = driver.session()
  const lastName = 'Duval'

  // eslint-disable-next-line functional/no-try-statement
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
