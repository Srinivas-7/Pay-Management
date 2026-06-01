const express = require('express');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Logging & CORS middleware
app.use(morgan('dev'));
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'payroll_secret_key_123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Static files middleware (serves frontend)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Authentication check middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user_name) {
    return res.status(401).json({ error: 'Unauthorized: Not logged in' });
  }
  next();
};

// ==========================================
// Authentication APIs
// ==========================================

// GET session status
app.get('/api/auth/session', (req, res) => {
  if (req.session.user_name) {
    res.json({ loggedIn: true, user: { id: req.session.user_id, username: req.session.user_name } });
  } else {
    res.json({ loggedIn: false });
  }
});

// POST login
app.post('/api/auth/login', async (req, res) => {
  const { user_name, password } = req.body;
  if (!user_name || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const query = 'SELECT id, user_name FROM users WHERE user_name = ? AND password = ?';
    const [rows] = await db.query(query, [user_name, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Please enter correct username and password.' });
    }

    const user = rows[0];
    req.session.user_name = user.user_name;
    req.session.user_id = user.id;
    res.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    if (error.code === 'ECONNREFUSED' || error.syscall === 'connect') {
      return res.status(500).json({
        error: 'Database connection failed. Please ensure MySQL is running in XAMPP (Port 3306) and database "payroll" is imported.'
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// POST change password
app.post('/api/auth/change-password', requireAuth, async (req, res) => {
  const user_name = req.session.user_name;
  const { 'old-password': oldPassword, password: newPassword, password1: rePassword } = req.body;

  if (!oldPassword || !newPassword || !rePassword) {
    return res.status(400).json({ error: 'All password fields are required.' });
  }

  if (newPassword.length < 5) {
    return res.status(400).json({ error: 'Weak Password: must be greater than 5 characters.' });
  }

  if (newPassword !== rePassword) {
    return res.status(400).json({ error: "The two passwords don't match" });
  }

  try {
    const [rows] = await db.query('SELECT password FROM users WHERE user_name = ?', [user_name]);
    if (rows.length === 0 || rows[0].password !== oldPassword) {
      return res.status(400).json({ error: 'Wrong Old Password' });
    }

    await db.query('UPDATE users SET password = ? WHERE user_name = ?', [newPassword, user_name]);
    res.json({ success: true, message: 'Password Updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// Employee Management APIs
// ==========================================

// GET all employees
app.get('/api/employees', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, branch, department, phone, email FROM employee');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Fetch employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single employee details
app.get('/api/employees/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM employee WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee does not exist!' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Fetch employee detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST add new employee
app.post('/api/employees', requireAuth, async (req, res) => {
  const { name, dob, gender, address, phone, email, branch, department, startdate, shift, basic } = req.body;

  if (!name || !dob || !gender || !address || !phone || !email || !branch || !department || !startdate || !shift || !basic) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Email regex validation (matching original PHP)
  const regexEmail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i;
  if (!regexEmail.test(email)) {
    return res.status(400).json({ error: 'Not a valid Email Id' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM employee WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Employee Already exists!' });
    }

    // Insert employee
    const query = `
      INSERT INTO employee 
      (name, dob, gender, address, branch, department, startdate, shift, basic, phone, email, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.query(query, [name, dob, gender, address, branch, department, startdate, shift, basic, phone, email]);
    
    res.json({ success: true, message: 'Employee Data Stored!' });
  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE employee
app.delete('/api/employees/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM employee WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    res.json({ success: true, message: 'Employee data deleted!' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// Salary Calculations APIs
// ==========================================

// GET calculate salary slip details
app.get('/api/employees/:id/calculate-salary', requireAuth, async (req, res) => {
  const { id } = req.params;
  const leave = parseFloat(req.query.leave) || 0;
  const overtimeHours = parseFloat(req.query.overtime) || 0;
  const conveyence = parseFloat(req.query.conveyence) || 0;

  try {
    const [rows] = await db.query('SELECT basic, name, startdate, department FROM employee WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No employee found!' });
    }

    const employee = rows[0];
    const basic = parseFloat(employee.basic);
    
    // Formula calculations mapping directly to PHP:
    const DA = basic * (1 / 2);              // Dearness Allowance
    const HRA = basic * (1 / 10);            // House Rent Allowance
    const MA = basic * (3 / 100);            // Medical Allowance
    const PF = 780;                          // Provident Fund
    const PT = 200;                          // Professional Tax
    const worked = 30 - leave;
    const leave_deduction = (basic / 30) * leave;
    const overtime_payment = ((basic / 30) / 24) * overtimeHours;
    
    const Salary = (basic + DA + HRA + MA + overtime_payment + conveyence) - (PF + PT + leave_deduction);

    res.json({
      success: true,
      data: {
        id,
        name: employee.name,
        department: employee.department,
        startdate: employee.startdate,
        basic,
        DA,
        HRA,
        MA,
        PF,
        PT,
        worked,
        leave,
        overtimeHours,
        overtime_payment,
        conveyence,
        leave_deduction,
        Salary: Math.round(Salary * 100) / 100 // Round to 2 decimal places
      }
    });
  } catch (error) {
    console.error('Calculate salary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// Records Management APIs
// ==========================================

// GET all past payslip records
app.get('/api/records', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM record ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Fetch records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST save a payslip record
app.post('/api/records', requireAuth, async (req, res) => {
  const { save_id, leave, overtime, conveyence } = req.body;

  if (!save_id) {
    return res.status(400).json({ error: 'Employee ID is required.' });
  }

  try {
    const query = 'INSERT INTO record (employee_id, leaves, overtime, conveyence, created_at) VALUES (?, ?, ?, ?, NOW())';
    await db.query(query, [save_id, leave || 0, overtime || 0, conveyence || 0]);
    res.json({ success: true, message: 'Pay Slip saved!' });
  } catch (error) {
    console.error('Save record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a past payslip record
app.delete('/api/records/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM record WHERE record_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    res.json({ success: true, message: 'Record Deleted!' });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Catch-all to serve frontend for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
