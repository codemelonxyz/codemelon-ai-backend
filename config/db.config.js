import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Create a connection to the database
const dbConfigUrl = process.env.DB_CONFIG_URL;
const pool = mysql.createPool({
  uri: dbConfigUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;