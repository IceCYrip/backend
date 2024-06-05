const { Pool } = require('pg')
const express = require('express')
const app = express()
const http = require('http')

const server = http.createServer(app)

const port = 5000
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

const connectToDB = async () => {
  pool
    .connect()
    .then(async () => {
      console.log('Connected to database successfully')

      server.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
      })
    })
    .catch((err) => console.error('Connection error', err.stack))
}

module.exports = connectToDB
module.exports.app = app
module.exports.pool = pool
module.exports.server = server
