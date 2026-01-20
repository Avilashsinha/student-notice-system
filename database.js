const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Determine if we're in production (Vercel) or development
const isProduction = process.env.NODE_ENV === 'production';
const usePostgres = process.env.DATABASE_URL || isProduction;

let db;
let pool;

// Initialize database connection based on environment
if (usePostgres) {
  // PostgreSQL for production (Vercel)
  console.log('Using PostgreSQL database');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? {
      rejectUnauthorized: false
    } : false
  });

  // Test connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err.message);
    } else {
      console.log('Connected to PostgreSQL database');
      initializePostgresDatabase();
    }
  });
} else {
  // SQLite for local development
  console.log('Using SQLite database');
  const dbPath = path.join(__dirname, 'student_notices.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log(`Connected to SQLite database at: ${dbPath}`);
      initializeSQLiteDatabase();
    }
  });
}

// Initialize PostgreSQL database tables
async function initializePostgresDatabase() {
  try {
    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Students table ready (PostgreSQL)');

    // Create notices table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Notices table ready (PostgreSQL)');
  } catch (err) {
    console.error('Error initializing PostgreSQL database:', err.message);
  }
}

// Initialize SQLite database tables
function initializeSQLiteDatabase() {
  // Create students table
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating students table:', err.message);
    } else {
      console.log('Students table ready (SQLite)');
    }
  });

  // Create notices table
  db.run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating notices table:', err.message);
    } else {
      console.log('Notices table ready (SQLite)');
    }
  });
}

// Database operations with dual support
const dbOperations = {
  // Student operations
  registerStudent: (name, phoneNumber, email) => {
    return new Promise((resolve, reject) => {
      if (usePostgres) {
        pool.query(
          'INSERT INTO students (name, phone_number, email) VALUES ($1, $2, $3) RETURNING *',
          [name, phoneNumber, email],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const row = result.rows[0];
              resolve({ id: row.id, name: row.name, phoneNumber: row.phone_number, email: row.email });
            }
          }
        );
      } else {
        const query = 'INSERT INTO students (name, phone_number, email) VALUES (?, ?, ?)';
        db.run(query, [name, phoneNumber, email], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, phoneNumber, email });
          }
        });
      }
    });
  },

  getAllStudents: () => {
    return new Promise((resolve, reject) => {
      if (usePostgres) {
        pool.query('SELECT * FROM students ORDER BY registered_at DESC', [], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows);
          }
        });
      } else {
        db.all('SELECT * FROM students ORDER BY registered_at DESC', [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }
    });
  },

  getStudentByEmail: (email) => {
    return new Promise((resolve, reject) => {
      if (usePostgres) {
        pool.query('SELECT * FROM students WHERE email = $1', [email], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows[0]);
          }
        });
      } else {
        db.get('SELECT * FROM students WHERE email = ?', [email], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }
    });
  },

  // Notice operations
  createNotice: (title, content) => {
    return new Promise((resolve, reject) => {
      if (usePostgres) {
        pool.query(
          'INSERT INTO notices (title, content) VALUES ($1, $2) RETURNING *',
          [title, content],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const row = result.rows[0];
              resolve({ id: row.id, title: row.title, content: row.content });
            }
          }
        );
      } else {
        const query = 'INSERT INTO notices (title, content) VALUES (?, ?)';
        db.run(query, [title, content], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, title, content });
          }
        });
      }
    });
  },

  getAllNotices: () => {
    return new Promise((resolve, reject) => {
      if (usePostgres) {
        pool.query('SELECT * FROM notices ORDER BY posted_at DESC', [], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows);
          }
        });
      } else {
        db.all('SELECT * FROM notices ORDER BY posted_at DESC', [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }
    });
  },

  deleteNotice: (id) => {
    return new Promise((resolve, reject) => {
      if (usePostgres) {
        pool.query('DELETE FROM notices WHERE id = $1', [id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({ deletedId: id, changes: result.rowCount });
          }
        });
      } else {
        db.run('DELETE FROM notices WHERE id = ?', [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ deletedId: id, changes: this.changes });
          }
        });
      }
    });
  },

  deleteStudent: (id) => {
    return new Promise((resolve, reject) => {
      if (usePostgres) {
        pool.query('DELETE FROM students WHERE id = $1', [id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({ deletedId: id, changes: result.rowCount });
          }
        });
      } else {
        db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ deletedId: id, changes: this.changes });
          }
        });
      }
    });
  }
};

module.exports = { db, pool, dbOperations };
