const { Pool } = require('pg')

const defaultClient = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MAINDB, // Connect to the default database to check/create the target database
})

const checkDatabase = async () => {
  const dbName = process.env.DB_NAME
  try {
    const result = await defaultClient.query(
      `SELECT 1 AS exists FROM pg_database WHERE datname = $1`,
      [dbName]
    )
    if (result.rowCount === 0) {
      await defaultClient.query(`CREATE DATABASE ${dbName}`)
      console.log(`Database '${dbName}' created`)
    }
  } catch (err) {
    console.error('Error creating database', err.message)
  }
}

module.exports = checkDatabase
