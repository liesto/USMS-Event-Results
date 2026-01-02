/**
 * MySQL Database Configuration and Connection Pool
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const poolConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'usms_main',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}

export const pool = mysql.createPool(poolConfig)

/**
 * Test database connection
 */
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection()
    console.log('✓ Database connected successfully')
    connection.release()
  } catch (error) {
    console.error('✗ Database connection failed:', error)
    throw error
  }
}

/**
 * Execute a query with automatic connection handling
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows as T[]
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

/**
 * Execute a single-row query
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows.length > 0 ? rows[0] : null
}
