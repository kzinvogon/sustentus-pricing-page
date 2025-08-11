const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sustentus_master',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
let pool = null;

// Initialize database connection
async function initializeDatabase() {
  try {
    // First connect without database to create it if it doesn't exist
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    
    const tempConnection = await mysql.createConnection(tempConfig);
    
    // Create database if it doesn't exist
    await tempConnection.execute('CREATE DATABASE IF NOT EXISTS sustentus_master');
    await tempConnection.end();
    
    // Now create the pool with the database
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Get database connection from pool
async function getConnection() {
  if (!pool) {
    await initializeDatabase();
  }
  return pool.getConnection();
}

// Execute a query with parameters
async function executeQuery(sql, params = []) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(sql, params);
    connection.release();
    return rows;
  } catch (error) {
    console.error('❌ Query execution failed:', error);
    throw error;
  }
}

// Execute a query and return the first row
async function executeQuerySingle(sql, params = []) {
  const rows = await executeQuery(sql, params);
  return rows[0] || null;
}

// Execute a transaction
async function executeTransaction(queries) {
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const query of queries) {
      const [rows] = await connection.execute(query.sql, query.params || []);
      results.push(rows);
    }
    
    await connection.commit();
    connection.release();
    return results;
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}

// Close database connection
async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ Database connection closed');
  }
}

// Health check
async function healthCheck() {
  try {
    const result = await executeQuery('SELECT 1 as health');
    return result[0]?.health === 1;
  } catch (error) {
    return false;
  }
}

module.exports = {
  initializeDatabase,
  getConnection,
  executeQuery,
  executeQuerySingle,
  executeTransaction,
  closeDatabase,
  healthCheck,
  pool
};
