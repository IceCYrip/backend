const initaliseTables = async (pool) => {
  const createUserTable = `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(100)
          );`
  const createRoomTable = `
          CREATE TABLE IF NOT EXISTS rooms (
            room_id SERIAL PRIMARY KEY,
            host_id INTEGER NOT NULL,
            created_date DATE NOT NULL,
            created_time TIME NOT NULL,
            participants TEXT
          );`

  try {
    await pool.query(createUserTable)
    console.log('Created user table')
    await pool.query(createRoomTable)
    console.log('Created room table')
  } catch (err) {
    console.error('Error creating tables: ', err.message)
  }
}

module.exports = initaliseTables
