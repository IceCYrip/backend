const { pool } = require('../db/connectToDb')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])

    if (user?.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const response = {
      name: user.rows[0].name,
      email: user.rows[0].email,
      id: user.rows[0].id,
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('catchError: ', error)
    // Handle errors, such as unique constraint violations
    res.status(500).json({ error: 'Internal server error' })
  }
}

const register = async (req, res) => {
  const { name, email, password } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Validate the request body
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Name, email and password are required' })
  }

  try {
    //Check if already exists
    const exists = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])

    if (exists?.rowCount) {
      res.status(400).json({ error: 'Email already exists' })
    } else {
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
      )

      const response = { name, email, id: result.rows[0]?.id }

      // Send the inserted user data as the response
      res.status(201).json(response)
    }

    // Insert the new user into the users table
  } catch (error) {
    console.error('catchError: ', error)
    // Handle errors, such as unique constraint violations
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { login, register }
