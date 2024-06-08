const { pool } = require('../db/connectToDb')

const createRoom = async (req, res) => {
  try {
    const { host_id } = req.body

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1 // Months are zero-based, so we add 1
    const day = currentDate.getDate()

    const hours = currentDate.getHours()
    const minutes = currentDate.getMinutes()
    const seconds = currentDate.getSeconds()

    const newRoom = await pool.query(
      'INSERT INTO rooms (host_id, created_date, created_time, participants) VALUES ($1, $2, $3, $4) RETURNING room_id;',
      [host_id, `${day}-${month}-${year}`, `${hours}:${minutes}:${seconds}`, '']
    )

    res.status(200).json(newRoom.rows[0])
  } catch (error) {
    console.error('catchError: ', error)
    // Handle errors, such as unique constraint violations
    res.status(500).json({ error: 'Internal server error' })
  }
}

const roomExists = async (req, res) => {
  try {
    const { room_id } = req.body

    const roomDetails = await pool.query(
      'SELECT * FROM rooms WHERE room_id = $1',
      [room_id]
    )

    if (roomDetails?.rowCount === 0) {
      return res.status(404).json({ error: 'Room not found' })
    } else {
      return res.status(200).json({ exists: true })
    }
  } catch (error) {
    console.error('catchError: ', error)
    // Handle errors, such as unique constraint violations
    res.status(500).json({ error: 'Internal server error' })
  }
}
const checkRoomHost = async (req, res) => {
  try {
    const { room_id, user_id } = req.body

    const roomDetails = await pool.query(
      'SELECT * FROM rooms WHERE room_id = $1',
      [room_id]
    )

    if (roomDetails?.rowCount === 0) {
      return res.status(404).json({ error: 'Room not found' })
    } else {
      return res
        .status(200)
        .json({ isHost: roomDetails.rows[0].host_id == user_id })
    }
  } catch (error) {
    console.error('catchError: ', error)
    // Handle errors, such as unique constraint violations
    res.status(500).json({ error: 'Internal server error' })
  }
}
const APIcheck = async (req, res) => {
  try {
    const { room_id } = req.body

    const roomAfterUpdate = await pool.query(
      'SELECT * FROM rooms WHERE room_id = $1',
      [room_id]
    )

    const participants = await pool.query(
      `SELECT name from users WHERE id IN (${roomAfterUpdate.rows[0]['participants']})`
    )

    return res.status(200).json(participants.rows?.map((j) => j?.name))
  } catch (error) {
    console.error('catchError: ', error)
    // Handle errors, such as unique constraint violations
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createRoom, checkRoomHost, roomExists, APIcheck }
