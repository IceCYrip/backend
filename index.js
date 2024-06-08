const cors = require('cors')
const { app, server, express } = require('./db/connectToDb')
const { Server } = require('socket.io')
const { pool } = require('./db/connectToDb')

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})
const connectToDB = require('./db/connectToDb')
const initialiseDatabase = require('./db/initialiseDb')
const { login, register } = require('./controller/user')
const {
  createRoom,
  checkRoomHost,
  roomExists,
  APIcheck,
} = require('./controller/room')
const roomHandler = require('./socket/room')

app.use(express.json())
app.use(cors())

const userSocketMap = {} //{userId: socketId}

//User APIs
app.post('/createUser', register)
app.post('/login', login)

//room APIs
app.post('/createRoom', createRoom)
app.post('/roomExists', roomExists)
app.post('/checkRoomHost', checkRoomHost)
app.post('/APIcheck', APIcheck)

const startServer = async () => {
  await initialiseDatabase()
  await connectToDB()

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId

    if (!!userId) {
      userSocketMap[userId] = socket.id
      console.log('userSocketMap: ', userSocketMap)
    }
    // io.emit('getConnectedUsers', Object.keys(userSocketMap))

    roomHandler(socket, io)

    socket.on('error', (errorMessage) => {
      console.error('Error received from server: ', errorMessage)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id)
      delete userSocketMap[userId]
      io.emit('getConnectedUsers', Object.keys(userSocketMap))
    })
  })
}

startServer()
