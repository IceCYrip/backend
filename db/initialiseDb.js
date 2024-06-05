const { Pool } = require('pg')
const createTables = require('./createTables.js')
const checkDatabase = require('./checkDB.js')

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

const initialiseDatabase = async () => {
  await checkDatabase()
  await createTables(pool)
}

module.exports = initialiseDatabase
