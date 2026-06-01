# PayMaster - Modern Payroll Management System

[![Deploy to Render](https://render.com/images/deploy-to-render.button.svg)](https://render.com/deploy?repo=https://github.com/Srinivas-7/Pay-Management)

A sleek, premium, and modern Payroll Management System rebuilt entirely in **Node.js, Express, and SQLite3**. This project has been migrated from a legacy PHP/MySQL implementation, removing all dependencies on Apache and XAMPP.

---

## 🚀 Features

- **XAMPP-Free & Self-Contained:** Runs entirely from the terminal using an embedded SQLite database (`payroll.db`).
- **Premium Glassmorphism Dark Theme:** Stunning CSS dark-mode dashboard with modern typography, smooth micro-animations, and harmonized color palettes.
- **Indian Rupee (₹) Formatting:** All salary calculations, slips, and inputs default to the Indian Rupee (`₹`).
- **Comprehensive CRUD Directory:** Manage employee files, shifts, basic pay structure, and departments.
- **Dynamic Salary Processor:** Computes allowances (DA, HRA, MA) and deductions (PF, PT, unpaid leaves, and overtime hours) in real-time.
- **Perfect PDF Payslips:** Export clean, print-ready, single-page PDF payslips (powered by `html2pdf.js` with scroll-bug corrections).
- **Webcam & Gallery Profile Uploader:** Capture profile pictures live from your camera/webcam via WebRTC, or choose an image from your device's gallery.
- **Database Viewer Utility:** Easily inspect database tables and data directly inside the terminal.

---

## 🛠️ Technology Stack

- **Backend:** Node.js (v16+), Express, SQLite3 (`sqlite3`), Express-Session, Cors, Morgan
- **Frontend:** Vanilla HTML5, Custom HSL Hued Vanilla CSS (Glassmorphism), Vanilla ES6 JavaScript
- **Libraries:** `html2pdf.js` (PDF exports), Custom WebRTC Webcam Capture API

---

## 🏁 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16.0.0 or higher recommended).

### 1. Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
On the first run, the app will automatically seed default variables. You can edit or inspect settings in your `.env` file:
```env
PORT=3000
SESSION_SECRET=super_secret_payroll_key_123!@#
```

### 3. Start the Server
Run the startup script:
```bash
npm start
```
Your server will start on **`http://localhost:3000`**.

### 4. Admin Credentials
Log in with the default admin account:
* **Username:** `admin`
* **Password:** `admin@123`

*(Note: You can change the admin password at any time via the Settings tab in the application).*

---

## 🗄️ How to View/Inspect the Database

Since this application utilizes **SQLite** instead of MySQL, you do not need XAMPP or `phpMyAdmin` running to see database content.

### Method A: Use the Terminal Utility (Easiest)
Run the custom Node script to print all database tables and current records directly in your command line:
```bash
node view_db.js
```

### Method B: VS Code Extension (Best Visual View)
1. Install the **SQLite Viewer** extension in VS Code.
2. Click on the `payroll.db` file in the file explorer to view your tables like a spreadsheet.

---

## 🌐 Deployment Guidelines

This app has been updated to dynamically configure its database location via environment variables (`DATABASE_PATH`), making it ready for cloud production:

### 1. Railway.app (Recommended)
1. Push your project to a GitHub repository.
2. Link your repository to Railway as a Node.js web service.
3. Attach a **Persistent Volume** in the Railway service settings mounted to `/app/data`.
4. Define the environment variable: `DATABASE_PATH` = `/app/data/payroll.db`.

### 2. Render.com
1. Connect your GitHub repository to Render as a Web Service.
2. Add a **Persistent Disk** mounted to `/data`.
3. Set the environment variable: `DATABASE_PATH` = `/data/payroll.db`.

---
*Created and maintained with ❤️ for Srinivas.*
