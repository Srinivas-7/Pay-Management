require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'payroll.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error: Could not connect to SQLite database at:', dbPath);
    console.error(err.message);
    process.exit(1);
  }
});

function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function viewDatabase() {
  try {
    console.log('==================================================');
    console.log('       PAYMASTER DATABASE VIEWER (SQLITE)         ');
    console.log('==================================================');
    console.log(`Database File: ${dbPath}\n`);

    // 1. List Tables
    const tables = await queryAll("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    console.log('📋 Tables in Database:');
    console.table(tables);
    console.log('\n');

    // 2. Show 'users' table
    if (tables.some(t => t.name === 'users')) {
      console.log('👤 [Table: users] - Admin Authentication Credentials:');
      const users = await queryAll("SELECT id, user_name, password FROM users");
      if (users.length > 0) {
        console.table(users);
      } else {
        console.log('No user records found.');
      }
      console.log('\n');
    }

    // 3. Show 'employee' table
    if (tables.some(t => t.name === 'employee')) {
      console.log('👔 [Table: employee] - Employee Directory:');
      const employees = await queryAll("SELECT id, name, dob, gender, branch, department, basic, phone, email FROM employee");
      if (employees.length > 0) {
        console.table(employees);
      } else {
        console.log('No employee records found.');
      }
      console.log('\n');
    }

    // 4. Show 'record' table
    if (tables.some(t => t.name === 'record')) {
      console.log('📝 [Table: record] - Saved Payslip/Salary Calculations Records:');
      const records = await queryAll(`
        SELECT 
          r.record_id, 
          r.employee_id, 
          e.name AS employee_name, 
          r.leaves, 
          r.overtime, 
          r.conveyence, 
          r.created_at 
        FROM record r
        LEFT JOIN employee e ON r.employee_id = e.id
      `);
      if (records.length > 0) {
        console.table(records);
      } else {
        console.log('No payroll records found.');
      }
      console.log('\n');
    }

  } catch (error) {
    console.error('❌ Error viewing database content:', error.message);
  } finally {
    db.close((err) => {
      if (err) console.error('Error closing the database connection:', err.message);
      else console.log('==================================================');
    });
  }
}

viewDatabase();
