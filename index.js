const { app, pool, server } = require('./db/connectToDb')
const { Server } = require('socket.io')
const io = new Server(server)

const initialiseDatabase = require('./db/initialiseDb')
const connectToDB = require('./db/connectToDb')

const userSocketMap = {} //{userId: socketId}

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

  io.on('connection', (socket) => {
    console.log('socketId', socket.id)

    const userId = socket.handshake.query.userId

    if (!!userId) {
      userSocketMap[userId] = socket.id
    }

    io.emit('getConnectedUsers', Object.keys(userSocketMap))

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id)
      delete userSocketMap[userId]
    })
  })
}

startServer()
