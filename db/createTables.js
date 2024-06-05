const initaliseTables = async (pool) => {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(100)
          );`

  try {
    await pool.query(createTableQuery)
  } catch (err) {
    console.error('Error creating users table', err.message)
  }
}

module.exports = initaliseTables
