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
**PayMaster** is an advanced, production-ready, full-stack payroll administration and employee records platform developed by students from the Department of Information Science and Engineering at BMS College of Engineering. The system is engineered to solve the operational bottlenecks, administrative delays, and infrastructure complexities associated with traditional corporate payroll processing. By replacing legacy web scripts and local server dependencies (such as heavy web hosting environments, local database setups, and external port configurations) with a unified, lightweight Node.js and Express framework, PayMaster introduces an elegant, self-contained architecture suitable for modern organizational deployment.

The client-facing frontend features a premium glassmorphic user interface styled with custom HSL-hued Vanilla CSS. Designed with dark-theme aesthetics to reduce eye strain, the layout incorporates clear, solid headers, micro-animations, and icon-only navigation menus equipped with standard tooltips. Media capabilities include a WebRTC webcam capture console that accesses client-side camera devices via user permission models and merges base64 captures with local file uploads. Payslips are compiled using custom print-coordinate overrides inside `html2pdf.js`, generating single-page documents in Indian Rupees (`₹`) that are clean and free of truncation.

The backend leverages a modular Node.js/Express server that runs both API controllers and static routers. It implements a **hybrid database model** designed to use a local, zero-config SQLite3 file database for offline development, and automatically switch to secure, TLS/SSL-enabled remote MySQL databases (e.g., Aiven or TiDB Cloud) when environment variables are detected during cloud deployments. Session management is handled statelessly via signed, client-side cookie packets (`cookie-session`), resolving session resets during serverless container recycling on platforms like Vercel. 

Key modules include an interactive employee CRUD directory, a real-time compensation calculator (allowances like DA, HRA, MA, and deductions like PF, PT, overtime wages, and unpaid leaves), a historical records statement archive, and an interactive database command-line utility. Ultimately, the project demonstrates how classic monolithic tools can be modernized into secure, portable, and scalable web solutions.

---

### C E R T I F I C A T E
This is to certify that the FSD Report under Alternate Assessment Tool entitled **“PayMaster”** is a bona-fide work carried out by **Aniket V Korwar (1BM23IS403)**, **Rohan Raju Navalyal (1BM22IS162)**, and **Sathwik K (1BM22IS253)** in partial fulfilment for the award of degree of Bachelor of Engineering in Information Science and Engineering from Visvesvaraya Technological University, Belgaum during the academic year 2025-2026. It is certified that all corrections/suggestions indicated for Internal Assessments have been incorporated in the report deposited in the departmental library. The FSD Report has been approved as it satisfies the academic requirements in respect of AAT prescribed for the Bachelor of Engineering Degree.

<br>
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
| **5.1**| Screenshots | 6 |
| **5.2**| Link to Deployed Project | 7 |
| **6.1**| Challenges Faced | 7 |
| **6.2**| Learnings | 9 |
| **7** | Conclusion | 11 |

---

### 1. Introduction
In the contemporary corporate landscape, the administration of employee compensation, benefits, tax deductions, and records is a critical operational task. Traditionally, small-to-medium enterprises and educational departments relied on manual spreadsheets or outdated server architectures. These legacy systems (often built on monolithic web scripts and relational databases) required hosting setups, making them complex to set up, difficult to scale, and prone to display issues on mobile screens.

Furthermore, managing payroll calculations manually is highly susceptible to human error. A single incorrect allowance percentage or an unchecked tax boundary can result in payment discrepancies, leading to employee dissatisfaction and compliance risks. Additionally, generating physical payslips or manually converting web pages to PDF documents often leads to formatting errors, such as layout truncation, overlapping text, or vertical overflow across multiple pages.

Recognizing the need for a modern, lightweight, and deployment-friendly payroll console, **PayMaster** was conceptualized and developed. The project focuses on taking a legacy administrative layout and migrating it into a modern, full-stack Node.js application. This setup eliminates the need for heavy local database configurations and complex setups, allowing the platform to run with a single command on any developer's machine while remaining ready for cloud deployment.

PayMaster combines modern backend runtime design with a clean user experience. The frontend is built with modern HTML5, ES6 JavaScript, and Vanilla CSS, utilizing glassmorphic styles and dark mode options to prevent eye strain for administrators. The backend leverages Express for API endpoints, while a hybrid database engine supports local SQLite3 files and remote cloud-based MySQL databases. Signed cookies (`cookie-session`) are used to ensure stable session handling on serverless platforms.

This report provides a comprehensive overview of the design, development, and implementation lifecycle of PayMaster. It reviews the technology stack, core features, challenges faced during development, and the lessons learned. The project reflects the team’s hands-on application of full-stack engineering principles in building a secure, responsive, and maintainable software solution.

---

### 2. Objective of the Project
The primary objective of this project is to design, develop, and deploy **PayMaster**, a modern payroll management application that replaces legacy platforms. The system aims to simplify administrative workflows by automating compensation calculations and providing secure, reliable data storage through a responsive web interface.

The specific objectives of the project are as follows:
1. **Eliminate Local Configuration Overhead:** Replace the legacy web server dependencies with a unified, lightweight Node.js/Express server that runs locally via a single command.
2. **Implement Hybrid Data Storage:** Develop an abstraction layer supporting SQLite3 for offline local runs and remote MySQL database servers with secure SSL transport for cloud deployments.
3. **Automate Calculations:** Build a calculation engine to compute allowances (DA - 50%, HRA - 10%, MA - 3%) and deductions (Provident Fund - ₹780, Professional Tax - ₹200, unpaid leaves, and overtime hours) in Indian Rupees (`₹`).
4. **Access WebRTC Devices:** Integrate client-side media devices using the WebRTC API to capture live employee photos from a webcam, alongside support for local image uploads.
5. **Optimize PDF Outputs:** Configure a PDF engine using `html2pdf.js` with locked scroll positions (`scrollY: 0`) to print payslips cleanly on a single page, avoiding truncation or rendering errors.
6. **Support Secure Stateless Sessions:** Implement signed cookie-based session management (`cookie-session`) to prevent login timeouts and infinite redirect loops on serverless host platforms like Vercel.
7. **Ensure UI Responsiveness:** Apply CSS grid and flexbox to create a glassmorphic dashboard that scales across different screen sizes, including monitors, laptops, and tablets.

Through these objectives, the project provides hands-on experience in full-stack web development. It demonstrates practical methods for handling state, styling responsive interfaces, managing databases, and integrating browser APIs. The project prepares students for modern software engineering roles by applying academic concepts to build a functional, real-world utility.

---

### 3. Technology Stack Used
To achieve high performance, scalability, and ease of deployment, PayMaster uses a modern, lightweight full-stack architecture that keeps frontend and backend code modular and maintainable.

#### Frontend Layer
* **HTML5 & Vanilla ES6 JavaScript:** Used to render pages dynamically and handle client-side logic. The frontend uses AJAX fetch requests to communicate with backend endpoints, avoiding page refreshes.
* **Vanilla CSS (HSL Color Space):** Implements a premium glassmorphic dark-theme UI. It uses custom CSS variables, flexbox, and grid layouts to ensure responsiveness and data transition effects.
* **html2pdf.js (incorporating html2canvas and jsPDF):** Handles client-side PDF generation by converting specific HTML elements into document layouts.
* **WebRTC Media Devices API:** Accesses device cameras (`navigator.mediaDevices.getUserMedia`) to capture base64-encoded profile photos.

#### Backend Layer
* **Node.js (v16+):** The runtime environment for the application.
* **Express Framework:** Manages routing, body parsing, static assets (`express.static`), and API endpoints.
* **cookie-session:** Signed cookie middleware used to store encrypted session states in the browser, keeping the serverless backend stateless.
* **Morgan & CORS:** Middleware for HTTP request logging and managing Cross-Origin Resource Sharing.

#### Database Layer
* **SQLite3 (`sqlite3`):** Default database for local runs, creating the table schemas and admin seeds automatically.
* **MySQL (`mysql2`):** Cloud-compatible database driver enabled dynamically when env variables are detected.
* **Local SQLite Connection:** Resolves to a local `payroll.db` file in the project folder for fast, offline testing.
* **Cloud MySQL Connection:** Connects securely using TLS/SSL (`rejectUnauthorized: false`) for cloud databases like Aiven.io or TiDB Cloud.

#### Development & Deployment Tools
* **Git & GitHub:** Version control, collaboration, and repository storage.
* **Vercel:** Cloud platform hosting the serverless Express APIs and public directory.

---

### 4. Key Features Implemented

#### 1. Secure Admin Authentication
A secure login interface prevents unauthorized access to employee records. It uses a hashed credentials schema, session controls, and a dedicated settings panel that allows administrators to change passwords securely.

#### 2. Employee Directory (CRUD)
A management panel allows administrators to add, view, inspect, and delete employee records. Each record stores name, date of birth, shift, joining date, basic pay, and contact information.

#### 3. Real-Time Compensation Calculator
An automated engine computes allowances and deductions dynamically. The calculations are based on basic pay inputs, leaves taken, overtime hours, and conveyance adjustments:
- **Dearness Allowance (DA):** 50% of Basic Pay.
- **House Rent Allowance (HRA):** 10% of Basic Pay.
- **Medical Allowance (MA):** 3% of Basic Pay.
- **Provident Fund (PF):** Flat ₹780 deduction.
- **Professional Tax (PT):** Flat ₹200 deduction.
- **Leave Deduction:** Calculated as `(Basic / 30) * leaves`.
- **Overtime Pay:** Calculated as `((Basic / 30) / 24) * overtime_hours`.

#### 4. Webcam Capture and Image Upload
A media utility is embedded in the profile section. It streams a live camera feed into an HTML5 Canvas, allowing administrators to snap employee photos or upload files. These images are saved as base64 strings in LocalStorage.

#### 5. Interactive PDF Payslip Generator
Generates a printable payslip displaying calculations, deductions, net salary, and signature lines in Indian Rupees (`₹`), with one-click PDF downloading.

#### 6. Stateless Session Persistence
By using signed cookies, the system prevents session loss on serverless platforms, ensuring users remain logged in across different backend container invocations.

#### 7. Past Statement Archive Ledger
Calculated payslips can be saved to the database archive, displaying leaves, overtime, conveyances, and net pay in a historical ledger for reference or deletion.

#### 8. Interactive Terminal DB Viewer
A custom utility script (`node view_db.js`) queries and prints database tables in ASCII format directly to the command line, simplifying debugging without requiring extra GUI database clients.

---

### 5.1 Screenshots

#### Admin Login Page
*A secure gateway using glassmorphic styling, input validation, and alert components for session entry.*

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

#### 1. Legacy Architecture Modernization
Gained practical experience in converting legacy monolithic structures and local setups into lightweight, modular Node.js Express APIs. This process highlighted the benefits of unified runtimes for code reduction and maintainability.

#### 2. Stateless Web Security
Learned how serverless platforms interact with authentication models. Investigated the transition from stateful RAM sessions to client-encrypted, signed cookies. This approach ensures session persistence across stateless, containerized environments.

#### 3. Abstraction of Multi-Dialect Databases
Developed a database module capable of switching between two distinct database dialects: SQLite3 for quick, zero-install local testing, and MySQL with secure TLS/SSL configurations for cloud deployments.

#### 4. WebRTC Canvas Integration
Acquired practical knowledge of browser media capture APIs. Integrated video streaming from webcam devices, drew frames to HTML5 canvas nodes, and stored compressed base64 strings in LocalStorage for cross-session caching.

#### 5. Layout and Print Coordinate Mapping
Understood browser rendering behaviors during print operations. Resolved canvas offsets in `html2pdf.js` by overriding scroll coordinates, ensuring pages generate correctly regardless of browser scroll states.

#### 6. Deployment Pipelines and Collaborative Workflows
Gained experience in managing repository staging, rebasing remote history, and automating build triggers on cloud platforms via GitHub integration.

---

### 7. Conclusion
The development of **PayMaster** represents the successful conversion of a legacy payroll system into a modern, containerizable web application. The project shows how classic server dependencies can be replaced by modern, stateless microservices to enhance speed, portability, and deployment convenience.

By using technologies such as Node.js, Express, SQLite, MySQL, and WebRTC, the application delivers a complete administrative dashboard with features like secure cookie authentication, live webcam captures, real-time allowance calculations, and single-page PDF payslip downloads. The hybrid database engine enables developers to test the project locally with zero installation, while maintaining seamless compatibility with cloud hosting.

In conclusion, PayMaster serves as a functional, secure payroll administrator console and provides a strong foundation in modernizing, securing, and deploying scalable full-stack applications.
