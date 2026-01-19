const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
// Use /tmp directory on Vercel (serverless), local directory for development
const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction
  ? '/tmp/student_notices.db'  // Vercel's writable temp directory
  : path.join(__dirname, 'student_notices.db');  // Local development

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
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
      console.log('Students table ready');
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
      console.log('Notices table ready');
    }
  });
}

// Database operations
const dbOperations = {
  // Student operations
  registerStudent: (name, phoneNumber, email) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO students (name, phone_number, email) VALUES (?, ?, ?)';
      db.run(query, [name, phoneNumber, email], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, phoneNumber, email });
        }
      });
    });
  },

  getAllStudents: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM students ORDER BY registered_at DESC', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  getStudentByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM students WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Notice operations
  createNotice: (title, content) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO notices (title, content) VALUES (?, ?)';
      db.run(query, [title, content], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, title, content });
        }
      });
    });
  },

  getAllNotices: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM notices ORDER BY posted_at DESC', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  deleteNotice: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM notices WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedId: id, changes: this.changes });
        }
      });
    });
  },

  deleteStudent: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedId: id, changes: this.changes });
        }
      });
    });
  }
};

module.exports = { db, dbOperations };
