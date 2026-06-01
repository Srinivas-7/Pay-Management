require('dotenv').config();
const path = require('path');
const fs = require('fs');

let db;

// Check if we should use MySQL (useful for Cloud Deployments like Vercel)
if (process.env.DB_HOST) {
  console.log('Database Mode: Using remote MySQL database');
  const mysql = require('mysql2/promise');

  const sslConfig = process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false };

  // Create MySQL connection pool
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'payroll',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: sslConfig
  });

  // Initialize MySQL tables on boot
  (async () => {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to MySQL database.');

      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_name VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS employee (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          dob VARCHAR(255) NOT NULL,
          gender VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          branch VARCHAR(255) NOT NULL,
          department VARCHAR(255) NOT NULL,
          startdate VARCHAR(255) NOT NULL,
          shift VARCHAR(255) NOT NULL,
          basic INT NOT NULL,
          phone VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          created_at VARCHAR(255) NOT NULL
        )
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS record (
          record_id INT AUTO_INCREMENT PRIMARY KEY,
          employee_id INT NOT NULL,
          leaves INT NOT NULL,
          overtime INT NOT NULL,
          conveyence INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Seed default admin credentials if table is empty
      const [rows] = await connection.query("SELECT id FROM users WHERE user_name = 'admin'");
      if (rows.length === 0) {
        await connection.query("INSERT INTO users (user_name, password) VALUES ('admin', 'admin@123')");
        console.log('Successfully seeded default MySQL admin credentials (admin / admin@123).');
      }

      connection.release();
    } catch (err) {
      console.error('Failed to initialize MySQL database tables:', err.message);
    }
  })();

  db = {
    query: async (sql, params = []) => {
      // Execute query on MySQL pool directly
      return await pool.query(sql, params);
    }
  };

} else {
  // SQLite Mode (Default for Local Development)
  console.log('Database Mode: Using local SQLite database');
  const sqlite3 = require('sqlite3').verbose();

  let dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'payroll.db');
  let dbConnection;

  function connectDatabase(targetPath) {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const conn = new sqlite3.Database(targetPath, (err) => {
        if (err) {
          console.error(`SQLite database connection error at ${targetPath}:`, err.message);
          triggerFallback(targetPath);
        } else {
          console.log(`Connected to SQLite database at: ${targetPath}`);
        }
      });
      return conn;
    } catch (err) {
      console.error(`Failed to initialize database path at ${targetPath}:`, err.message);
      return triggerFallback(targetPath);
    }
  }

  function triggerFallback(failedPath) {
    const fallbackPath = path.join(__dirname, '..', 'payroll.db');
    if (failedPath !== fallbackPath) {
      console.log(`Falling back to project-root database file at: ${fallbackPath}`);
      dbPath = fallbackPath;
      return new sqlite3.Database(fallbackPath, (err) => {
        if (err) {
          console.error('Failed to open fallback database:', err.message);
        } else {
          console.log(`Connected to fallback SQLite database at: ${fallbackPath}`);
        }
      });
    } else {
      console.error('Critical Error: Fallback database also failed to load.');
      return null;
    }
  }

  dbConnection = connectDatabase(dbPath);

  // Initialize SQLite tables synchronously on boot
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

  db = {
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
            resolve([{
              affectedRows: this.changes,
              insertId: this.lastID
            }]);
          });
        }
      });
    }
  };
}

module.exports = db;
