# B.M.S College of Engineering, Bengaluru-560019
### AUTONOMOUS INSTITUTE, AFFILIATED TO VTU
### DEPARTMENT OF INFORMATION SCIENCE & ENGINEERING

**Course** – Full Stack Development  
**Course Code** – 23IS6AEFSD  
**Ability Enhancement Course Project Titled**  
# “PayMaster”

**Submitted to:**  
**Dr. B S Mahalakshmi**,  
Associate Professor,  
Department of ISE, BMSCE, Bangalore  

**Submitted by Team Members:**  
* **1BM22IS253** – Sathwik K  
* **1BM23IS403** – Aniket V Korwar  
* **1BM22IS162** – Rohan Raju Navalyal  

---

### ABSTRACT
**PayMaster** is a modern, full-stack payroll management application designed and developed by students from the Department of Information Science at BMS College of Engineering. Engineered to automate payroll processing and employee records management, the platform eliminates the overhead of legacy server setups by providing a completely self-contained, light-weight, and modern deployment. 

The application leverages a premium, responsive frontend styled with Vanilla CSS implementing glassmorphic dark-theme aesthetics, solid-colored clear headers, and dynamic icon-only navigation bars. Rich-media integrations include a custom WebRTC webcam capture canvas for employee profile pictures and local gallery uploads. PDF generation is facilitated via `html2pdf.js` with scrollbar-rendering offsets configured to output clean single-page payslips in Indian Rupees (`₹`).

On the backend, a robust Node.js and Express framework serves both API endpoints and static assets. Data management is handled via a **hybrid database model** supporting zero-config local SQLite3 files and remote cloud-based MySQL servers for stateless hosting. Secure session storage is handled via client-side signed cookies (`cookie-session`), solving serverless session resets.

Key features include an interactive employee CRUD directory, real-time salary calculations (allowances like DA, HRA, MA, and deductions like PF, PT, overtime, and unpaid leaves), an archived record ledger, and a terminal-based SQLite interactive inspector. This project showcases the ability to modernize legacy architectures into secure, modular, and maintainable web applications.

---

### C E R T I F I C A T E
This is to certify that the FSD Report under Alternate Assessment Tool entitled **“PayMaster”** is a bona-fide work carried out by **Aniket korwar (1BM23IS403)**, **Rohan Navalyal (1BM22IS162)**, and **Sathwik K (1BM22IS253)** in partial fulfilment for the award of degree of Bachelor of Engineering in Information Science and Engineering from Visvesvaraya Technological University, Belgaum during the year 2025-2026. It is certified that all corrections/suggestions indicated for Internal Assessments have been incorporated in the report deposited in the departmental library. The FSD Report has been approved as it satisfies the academic requirements in respect of AAT prescribed for the Bachelor of Engineering Degree.

<br>

**Dr. B S Mahalakshmi**  
Associate Professor  

**Dr. Nalini M K**  
Associate Professor and HOD  

**Dr. Bheemsha Arya**  
Principal  

**Examiners:**  
1. **Name:** _______________________ **Signature:** _______________________  
2. **Name:** _______________________ **Signature:** _______________________  

---

### TABLE OF CONTENTS
| Sl No. | Topic | Page No. |
| :--- | :--- | :--- |
| **1** | Introduction | 1 |
| **2** | Objective of the Project | 2 |
| **3** | Technology Stack Used | 3 |
| **4** | Key Features Implemented | 4 |
| **5.1**| Screenshots | 5 |
| **5.2**| Link to Deployed Project | 7 |
| **6.1**| Challenges Faced | 7 |
| **6.2**| Learnings | 9 |
| **7** | Conclusion | 10 |

---

### 1. Introduction
In the contemporary corporate landscape, the administration of employee compensation, benefits, tax deductions, and records is a critical operational task. Traditionally, small-to-medium businesses relied on desktop spreadsheets or legacy server architectures requiring elaborate setups (such as XAMPP, Apache servers, and MySQL ports) to host their internal payroll tools. These platforms often suffered from visual clutter, poor device responsiveness, deployment friction, and high infrastructure overhead.

Recognizing the need for a modern, lightweight, and deployment-friendly administrative tool, **PayMaster** was conceptualized. The motivation behind this project was to take a legacy PHP/MySQL payroll system and migrate it into a modern, containerizable Node.js application that does not require XAMPP or complex MySQL setups for local testing, yet remains completely ready for cloud deployment. 

**PayMaster** is a full-stack payroll management console. It simplifies administrative operations by providing a web console that calculates salaries, maintains employee details, generates PDF payslips, and archives past payroll statements. The user interface utilizes glassmorphic elements and dark mode configurations to reduce eye strain for HR administrators who interact with spreadsheets and tables for extended periods.

By combining a Node.js/Express backend with a dual-mode database engine (supporting SQLite3 locally and MySQL in the cloud), PayMaster balances local development ease with production robustness. The client-side is entirely written in modern HTML5, ES6 JavaScript, and responsive CSS, avoiding build tools or bloated dependencies to optimize load speeds.

This report documents the design, architecture, key features, challenges, and implementation workflows of PayMaster, demonstrating the hands-on application of full-stack engineering principles in constructing secure and maintainable software.

---

### 2. Objective of the Project
The primary objective of this project is to develop and implement **PayMaster**, a self-contained payroll management application that replaces legacy PHP-based payroll software. It aims to streamline administrative tasks by offering automated calculation tools and secure record storage in an intuitive visual interface.

The specific objectives of the project are:
1. **Remove XAMPP Overhead:** Replace the legacy PHP/Apache dependency with a unified Node.js/Express server that runs locally via a single command.
2. **Simplify Local Data Storage:** Integrate an embedded SQLite3 file-based database for zero-configuration local runs, eliminating the need to set up MySQL database ports locally.
3. **Implement Secure Authentication:** Develop an administrator portal secured by signed cookie sessions (`cookie-session`) to allow safe stateless session management on cloud runtimes like Vercel.
4. **Automate Compensation Calculations:** Build an engine to calculate allowances (DA, HRA, MA) and deductions (PF, PT, overtime payments, and unpaid leave deductions) dynamically in Indian Rupees (`₹`).
5. **Support Visual Assets:** Integrate WebRTC media APIs to capture live employee photos from webcams and merge them with local uploads, caching them persistently in client-side storage.
6. **Generate Clean PDF Receipts:** Develop a print engine using `html2pdf.js` that prints receipts cleanly on a single page by locking scroll metrics and hiding browser UI elements.
7. **Ensure UI Responsiveness:** Apply CSS grid and flexbox to create a glassmorphic user interface optimized for varying monitor sizes and tablets.

---

### 3. Technology Stack Used
The architecture of PayMaster is split into a lightweight presentation layer, a controller API layer, and a hybrid database engine.

#### Frontend
- **HTML5 & Vanilla ES6 JavaScript:** Renders pages dynamically and handles AJAX fetch requests to backend endpoints.
- **Custom HSL Vanilla CSS:** Implements glassmorphism dark-theme tokens, interactive hover states, micro-animations, and clean typography.
- **html2pdf.js:** Client-side PDF generation package that captures HTML blocks and converts them into document layouts.
- **WebRTC Camera API:** Accesses device cameras (`navigator.mediaDevices.getUserMedia`) to capture base64-encoded profile photos.

#### Backend
- **Node.js & Express:** Serves backend APIs and handles static file routing (`express.static`) for the frontend.
- **cookie-session:** Lightweight signed-cookie session middleware designed to maintain login status on stateless serverless runtimes.
- **Morgan & CORS:** Middleware for HTTP request logging and Cross-Origin Resource Sharing handling.

#### Database
- **SQLite3 (`sqlite3`):** Default database for local runs, creating the table schemas and admin seeds automatically.
- **MySQL (`mysql2`):** Cloud-compatible database driver enabled dynamically when env variables are detected.

#### Deployment
- **GitHub:** Code version control and collaboration repository.
- **Vercel:** Cloud platform hosting the serverless Express APIs and public directory.

---

### 4. Key Features Implemented

1. **Secure Admin Authentication:**
   A login portal restricts access to authorized administrators. Admin passwords can be updated securely via the settings panel.
2. **Employee Directory (CRUD):**
   Full CREATE, READ, UPDATE, and DELETE operations to register new employees with their contact info, joining date, and basic pay.
3. **Allowance & Deduction Processor:**
   Automatically computes Dearness Allowance (DA - 50%), House Rent Allowance (HRA - 10%), Medical Allowance (MA - 3%), Provident Fund (PF - ₹780), Professional Tax (PT - ₹200), leave deductions, and overtime wages.
4. **Webcam Capture Profile Picture:**
   A live camera viewer is embedded into the profile panel, allowing administrators to snap photos of employees or upload existing image files, which are saved as base64 strings in LocalStorage.
5. **Interactive PDF Payslip Generator:**
   Renders payslips on a white-paper layout containing calculations, company stamps, and signature blocks, downloadable as a PDF.
6. **Stateless Session Persistence:**
   Uses signed cookies to prevent session loss, preventing redirect loops during serverless container recycling on Vercel.
7. **Past Records Archival Ledger:**
   Every calculated payslip can be archived. The system saves the inputs (leaves, overtime, conveyances) and presents them in a historical list where they can be re-printed or deleted.
8. **Interactive Terminal DB Viewer:**
   A custom script (`node view_db.js`) prints database tables in ASCII format to view SQLite records without installing GUI databases.

---

### 5.1 Screenshots

#### Login Page
*Secure administrator portal implementing styled input fields and glassmorphism styling.*

#### Home Page (Dashboard)
*A consolidated console containing the employee selector, input parameters (leaves, overtime hours, conveyances), and real-time calculations.*

#### Add Employee Page
*Structured registration form containing inputs for basic pay, branch, department, and shifts.*

#### Employee Details & Records Page
*Tabular browser listing active employees and detailed view models showing their full profiles.*

#### Past Statement Archive Ledger
*Historically saved payslips layout showing leaf offsets, overtime pay, and date stamps.*

#### Print-Ready Payslip Document
*Single-page official invoice displaying company signatures, totals in Rupees, and download PDF button.*

---

### 5.2 Link to Deployed Project
* **GitHub Repository:** [https://github.com/Srinivas-7/Pay-Management](https://github.com/Srinivas-7/Pay-Management)

---

### 6.1 Challenges Faced

#### 1. Serverless Session Reset (Infinite Redirect Loops)
- **Challenge:** On Vercel, serverless containers are recycled frequently. Since `express-session` stores session states in the server's local RAM (MemoryStore), every recycle wiped the active logins, throwing administrators back to the login screen continuously.
- **Resolution:** Replaced `express-session` with client-side signed `cookie-session`. The login credentials are now encrypted and stored inside the user's browser cookie. This makes the backend stateless and immune to serverless container restarts.

#### 2. Vercel Static Assets Packaging (404 Not Found Errors)
- **Challenge:** By default, Vercel only bundles JS dependencies referenced in imports. It excluded the `public/` and `img/` folders from the serverless function, causing Express static file routing to fail.
- **Resolution:** Modified `vercel.json` to include the `"config": { "includeFiles": ["public/**", "img/**", "payroll.db"] }` parameter, forcing Vercel to bundle static assets and the default database file together.

#### 3. SQLite Read-Only File Systems in Serverless Runtimes
- **Challenge:** Vercel containers run on a read-only filesystem. Read operations (`SELECT`) on `payroll.db` worked, but write operations (`INSERT` to add an employee) threw an internal server error.
- **Resolution:** Engineered a **hybrid database module** in `config/db.js` that checks for a `DB_HOST` variable. If present, it connects to a remote cloud-based MySQL database (Aiven/TiDB) using secure TLS/SSL. If absent, it seamlessly defaults to a local SQLite database file, keeping local runs zero-config.

#### 4. PDF Pagination and Scrollbar Render Bugs
- **Challenge:** When users downloaded payslips, the rendering engine captured the active scroll offsets, resulting in truncated layouts or huge blank spaces at the top of the PDF.
- **Resolution:** Configured the `html2pdf.js` constructor with `html2canvas` arguments (`scrollY: 0, scrollX: 0`) to lock print coordinates to the origin, producing a clean, single-page print document regardless of screen scrolling.

#### 5. Typography and Visual Clipping
- **Challenge:** Background clipping effects on page titles clipped the ascenders of capitalized header text on high-resolution displays.
- **Resolution:** Refactored gradient backgrounds to a flat HSL text color model to clean up the fonts across browsers.

---

### 6.2 Learnings

1. **Legacy Architecture Modernization:**
   Acquired experience in translating PHP controllers and Apache dependencies into modular Node.js Express APIs, streamlining application code.
2. **Stateless Web Architectures:**
   Understood how serverless environments interact with authentication, moving from RAM-dependent stateful sessions to client-encrypted cookies.
3. **Hybrid Database Configurations:**
   Understood how to construct runtime switches supporting multiple SQL dialects (SQLite for fast local testing and MySQL with SSL for cloud deployments) using a single query interface.
4. **WebRTC Integration:**
   Gained knowledge of streaming camera feeds into Canvas objects, taking snapshots, and converting them into base64 URLs for persistent browser storage.
5. **Print Layout Engineering:**
   Learned to handle canvas rendering bugs by overriding coordinate offsets inside client-side page rendering engines.
6. **Teamwork & Deployment Pipelines:**
   Strengthened coordination skills using Git, configuring environmental variables for cloud deployments, and automating builds via GitHub-Vercel hooks.

---

### 7. Conclusion
The development of **PayMaster** represents the successful conversion of a legacy payroll system into a modern, containerizable web application. The project shows how classic server dependencies can be replaced by modern, stateless microservices to enhance speed, portability, and deployment convenience.

By using technologies such as Node.js, Express, SQLite, MySQL, and WebRTC, the application delivers a complete administrative dashboard with features like secure cookie authentication, live webcam captures, real-time allowance calculations, and single-page PDF payslip downloads. The hybrid database engine enables developers to test the project locally with zero installation, while maintaining seamless compatibility with cloud hosting.

In conclusion, PayMaster serves as a functional, secure payroll administrator console and provides a strong foundation in modernizing, securing, and deploying scalable full-stack applications.
