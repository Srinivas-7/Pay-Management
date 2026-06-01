require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'payroll.db');
const dbConnection = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
  }
});

// Initialize database tables synchronously on boot
dbConnection.serialize(() => {
  dbConnection.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

  dbConnection.run(`
    CREATE TABLE IF NOT EXISTS employee (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      dob TEXT NOT NULL,
      gender TEXT NOT NULL,
      address TEXT NOT NULL,
      branch TEXT NOT NULL,
      department TEXT NOT NULL,
      startdate TEXT NOT NULL,
      shift TEXT NOT NULL,
      basic INTEGER NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  dbConnection.run(`
    CREATE TABLE IF NOT EXISTS record (
      record_id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      leaves INTEGER NOT NULL,
      overtime INTEGER NOT NULL,
      conveyence INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
    )
  `);

  // Seed default admin credentials if table is empty
  dbConnection.get("SELECT id FROM users WHERE user_name = 'admin'", [], (err, row) => {
    if (err) {
      console.error('Error checking default user:', err.message);
      return;
    }
    if (!row) {
      dbConnection.run("INSERT INTO users (user_name, password) VALUES ('admin', 'admin@123')", (insertErr) => {
        if (insertErr) {
          console.error('Failed to seed default admin credentials:', insertErr.message);
        } else {
          console.log('Successfully seeded default admin credentials (admin / admin@123).');
        }
      });
    }
  });
});

// Export mock pool querying interface that mirrors mysql2/promise
const db = {
  query: (sql, params = []) => {
    // Translate standard SQL syntax compatibility (NOW() -> SQLite datetime)
    let sqliteSql = sql.replace(/\bNOW\(\)/g, "datetime('now', 'localtime')");

    return new Promise((resolve, reject) => {
      const trimmedSql = sqliteSql.trim().toUpperCase();
      const isSelect = trimmedSql.startsWith('SELECT');

      if (isSelect) {
        dbConnection.all(sqliteSql, params, (err, rows) => {
          if (err) return reject(err);
          resolve([rows]);
        });
      } else {
        dbConnection.run(sqliteSql, params, function(err) {
          if (err) return reject(err);
          // Return insertion metadata resembling mysql2 shape
          resolve([{
            affectedRows: this.changes,
            insertId: this.lastID
          }]);
        });
      }
    });
  }
};

module.exports = db;
