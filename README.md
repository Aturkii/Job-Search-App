# Job Search Application

## Introduction
The **Job Search Application ** is a powerful web application designed to streamline the process of managing job postings and applications for companies. Built with Node.js, Express, and MongoDB, this system provides a robust backend to handle user authentication, role-based access control, CRUD operations for jobs and applications, and reporting capabilities via Excel sheets.

## Features
- **User Authentication:** Secure user authentication with JWT.
- **Role-Based Access Control:** Different access levels for Company HR and regular users.
- **CRUD Operations:** Create, read, update, and delete jobs and applications.
- **Excel Reporting:** Generate Excel reports for job applications on a specific date.
- **Validation and Error Handling:** Robust validation and error handling mechanisms.
- **Email Notifications:** Send email notifications for various actions (e.g., application submission).

## Technologies Used
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
- **Authentication:**
  - JSON Web Tokens (JWT)
  - bcrypt
- **Validation:**
  - Joi
- **Utilities:**
  - multer (for file uploads)
  - nodemailer (for sending emails)
  - exceljs (for generating Excel reports)
- **Other:**
  - dotenv (for environment variables)
  - moment (for date manipulation)
