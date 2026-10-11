# College Library Management System (Java Full Stack)

> Technical Training Project: Built using **Spring Boot**, **MySQL**, **React**, and **Maven**.

---

## 1. Project Overview & Abstract

The **College Library Management System** is a modern, full-stack web application designed to automate and streamline academic library operations:
- Student self-registration and credentialed login
- Dynamic book catalog with category filters and real-time title/author search
- Lending workflows: single-click book borrowing with automated loan duration & due date computation
- Overdue tracking and automated late fine calculations
- Administrator & Librarian dashboard featuring KPI metrics, book inventory CRUD operations, and circulation return desk

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | **React 18**, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | **Java 17+ / Spring Boot 3.3.4**, Spring Data JPA, Hibernate, REST |
| **Database** | **MySQL** (default, port 3306) & **H2** (zero-config in-memory dev profile) |
| **Build Tools** | **Maven 3.9+**, **npm** |
| **API Testing** | **Postman** (Collection included under `postman/`) |

---

## 3. System Architecture & Database Design

### 3-Tier Layered Architecture
```
[ React 18 Frontend ]  <--->  [ REST Controllers ]  <--->  [ Service Layer ]  <--->  [ JPA Repositories ]  <--->  [ MySQL / H2 ]
```

### Relational Database Schema (`database/library_db.sql`)

1. **`students`**
   - `student_id` INT AUTO_INCREMENT PRIMARY KEY
   - `name` VARCHAR(100) NOT NULL
   - `email` VARCHAR(100) NOT NULL UNIQUE
   - `password` VARCHAR(100) NOT NULL
   - `phone` VARCHAR(15)
   - `role` VARCHAR(20) DEFAULT 'STUDENT' (`STUDENT`, `LIBRARIAN`, `ADMIN`)
   - `created_at` TIMESTAMP

2. **`books`**
   - `book_id` INT AUTO_INCREMENT PRIMARY KEY
   - `title` VARCHAR(150) NOT NULL
   - `author` VARCHAR(100) NOT NULL
   - `category` VARCHAR(50) NOT NULL
   - `quantity` INT NOT NULL
   - `available_quantity` INT NOT NULL
   - `isbn` VARCHAR(20)
   - `created_at` TIMESTAMP

3. **`borrow`**
   - `borrow_id` INT AUTO_INCREMENT PRIMARY KEY
   - `student_id` INT (FK -> `students.student_id`)
   - `book_id` INT (FK -> `books.book_id`)
   - `issue_date` DATE NOT NULL
   - `due_date` DATE NOT NULL
   - `status` VARCHAR(20) DEFAULT 'BORROWED' (`BORROWED`, `OVERDUE`, `RETURNED`)

4. **`returns`**
   - `return_id` INT AUTO_INCREMENT PRIMARY KEY
   - `borrow_id` INT (FK -> `borrow.borrow_id`)
   - `return_date` DATE NOT NULL
   - `fine` DECIMAL(10, 2) DEFAULT 0.00

---

## 4. REST API Specification

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Register new student cardholder |
| `POST` | `/api/login` | Authenticate user (Student, Librarian, Admin) |
| `GET` | `/api/books` | List books (supports `?query=` & `?category=`) |
| `GET` | `/api/books/{id}` | Get book details by ID |
| `POST` | `/api/books` | Add new book to library inventory |
| `PUT` | `/api/books/{id}` | Update existing book details & copies |
| `DELETE` | `/api/books/{id}` | Remove book from inventory |
| `GET` | `/api/books/categories` | Retrieve list of all unique book categories |
| `POST` | `/api/borrow` | Issue book to student (`studentId`, `bookId`, `days`) |
| `PUT` | `/api/return/{id}` | Return book by borrow ID & compute fine |
| `GET` | `/api/borrow/student/{id}` | Get borrow history for a specific student |
| `GET` | `/api/borrow/all` | Get all institutional loans |
| `GET` | `/api/borrow/active` | Get currently unreturned loans |
| `GET` | `/api/borrow/overdue` | Get overdue loans |
| `GET` | `/api/dashboard` | Administrator KPI metrics & category breakdown |
| `GET` | `/api/dashboard/student/{id}` | Personal metrics for student portal |
| `GET` | `/api/students` | Get all registered students and users |

---

## 5. Seed Test Accounts

The database is pre-seeded with accounts for quick evaluation:

| Role | Email | Password | Name |
|---|---|---|---|
| **Student** | `aarav.sharma@college.edu` | `student123` | Aarav Sharma |
| **Student** | `priya.patel@college.edu` | `student123` | Priya Patel |
| **Librarian** | `librarian@library.college.edu` | `lib123` | Head Librarian |
| **Administrator** | `admin@library.college.edu` | `admin123` | System Administrator |

> **Pro-Tip**: The React frontend includes **1-Click Quick Demo Switcher buttons** in the navbar and login dialog to instantly test student vs admin roles without typing!

---

## 6. Project Folder Structure

```
d:\LibrarymanagmentSystem
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/library/
│   │   ├── config/             # CORS and MVC configuration
│   │   ├── controller/         # Auth, Book, Borrow, Dashboard, Student REST APIs
│   │   ├── dto/                # Request & Response Data Transfer Objects
│   │   ├── entity/             # Student, Book, Borrow, Return JPA entities
│   │   ├── repository/         # Spring Data JPA repositories
│   │   ├── service/            # Core business logic & fine calculation
│   │   └── LibraryManagementSystemApplication.java
│   └── src/main/resources/
│       ├── application.properties          # Default MySQL configuration
│       └── application-h2.properties       # Zero-config in-memory dev profile
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── api/                # client.js, authApi, bookApi, borrowApi, etc.
│   │   ├── context/            # AuthContext.jsx
│   │   ├── components/         # Navbar, StatCard, Modals, Toast, Footer
│   │   ├── pages/              # CatalogPage, StudentDashboard, AdminDashboard, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
├── database/
│   └── library_db.sql          # MySQL Schema DDL and Seed DML scripts
├── postman/
│   └── college_library_system.postman_collection.json
├── run-backend.bat             # 1-Click backend launcher
└── run-frontend.bat            # 1-Click React frontend launcher
```

---

## 7. How to Run the Application

### Option A: 1-Command Production Deployment with Docker Compose
```bash
docker compose up --build -d
```
Starts MySQL (`port 3306`), Spring Boot backend (`port 8080`), and React + Nginx (`port 80` & `port 5173`) with automated database initialization!

---

### Option B: Using 1-Click Launch Scripts (Windows)
1. Double-click `run-backend.bat` to launch the Spring Boot backend on `http://localhost:8080`.
2. Double-click `run-frontend.bat` to launch the React frontend on `http://localhost:5173`.
3. Open your browser and navigate to **`http://localhost:5173`**.

---

### Option C: Single Unified Runnable JAR
Build both React frontend and Spring Boot backend into a single self-contained JAR:
```bash
# Windows:
build-production.bat

# Linux / macOS:
bash build-production.sh
```
Run the generated JAR:
```bash
java -jar backend/target/library-management-system-1.0.0.jar
```
Both the React Web UI and the Spring Boot REST API are served directly from `http://localhost:8080`!

*(Detailed multi-cloud guides for Render, Railway, AWS, and Linux VMs are in [DEPLOYMENT.md](file:///d:/LibrarymanagmentSystem/DEPLOYMENT.md))*

---

### Option D: Running via Development Shells

#### 1. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```

#### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

---

## 8. Fine Calculation Policy

- **Standard Loan Period**: 14 Days (customizable to 7, 21, or 30 days during checkout)
- **Fine Rate**: ₹5.00 per day overdue
- **Formula**:
  $$\text{Fine} = \max(0, \, \text{Days Overdue} \times 5.00)$$
- Real-time automated calculation upon returning via `PUT /api/return/{id}`.

---

## 9. Future Enhancements (Roadmap)

Per Section 11 of the system specifications:
- **QR Code Book Issue**: Instant checkout via student mobile app
- **Barcode Scanner**: USB / camera scanner integration for ISBN lookup
- **Email Due Reminder**: Automated cron job notifying students 48 hours prior to due date
- **AI Book Recommendation**: Content-based filtering suggesting related research papers and textbooks
- **Digital Library PDF Access**: Built-in encrypted PDF reader for eBooks and lab manuals
