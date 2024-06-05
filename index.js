const { app, pool } = require('./db/connectToDb')
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const initialiseDatabase = require('./db/initialiseDb')
const connectToDB = require('./db/connectToDb')

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

const startServer = async () => {
  await initialiseDatabase()
  await connectToDB()
}

startServer()
