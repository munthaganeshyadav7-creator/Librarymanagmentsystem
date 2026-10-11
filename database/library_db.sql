-- =====================================================================
-- College Library Management System - Database Schema & Initial Data
-- As specified in the Technical Training Project Abstract (Section 6 & 8)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- 1. Students Table
DROP TABLE IF EXISTS returns;
DROP TABLE IF EXISTS borrow;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books Table
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    isbn VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Borrow Table
CREATE TABLE borrow (
    borrow_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'BORROWED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_borrow_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_borrow_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

-- 4. Return Table (named returns / return_record)
CREATE TABLE returns (
    return_id INT AUTO_INCREMENT PRIMARY KEY,
    borrow_id INT NOT NULL,
    return_date DATE NOT NULL,
    fine DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_return_borrow FOREIGN KEY (borrow_id) REFERENCES borrow(borrow_id) ON DELETE CASCADE
);

-- =====================================================================
-- Sample Seed Data
-- =====================================================================

-- Seed Students and Admin Users
INSERT INTO students (name, email, password, phone, role) VALUES
('System Administrator', 'admin@library.college.edu', 'admin123', '9876543210', 'ADMIN'),
('Head Librarian', 'librarian@library.college.edu', 'lib123', '9876543211', 'LIBRARIAN'),
('Aarav Sharma', 'aarav.sharma@college.edu', 'student123', '9123456780', 'STUDENT'),
('Priya Patel', 'priya.patel@college.edu', 'student123', '9123456781', 'STUDENT'),
('Rohan Verma', 'rohan.verma@college.edu', 'student123', '9123456782', 'STUDENT'),
('Ananya Iyer', 'ananya.iyer@college.edu', 'student123', '9123456783', 'STUDENT');

-- Seed Books
INSERT INTO books (title, author, category, quantity, available_quantity, isbn) VALUES
('Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Computer Science', 8, 7, '978-0132350884'),
('Introduction to Algorithms (CLRS)', 'Thomas H. Cormen', 'Algorithms', 5, 4, '978-0262033848'),
('Spring Boot in Action', 'Craig Walls', 'Web Development', 6, 6, '978-1617292545'),
('Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma et al.', 'Software Engineering', 4, 3, '978-0201633610'),
('Artificial Intelligence: A Modern Approach', 'Stuart Russell & Peter Norvig', 'Artificial Intelligence', 5, 5, '978-0136042594'),
('Database System Concepts', 'Abraham Silberschatz', 'Databases', 7, 7, '978-0073523323'),
('Head First Java', 'Kathy Sierra & Bert Bates', 'Programming', 10, 9, '978-0596009205'),
('Operating System Concepts', 'Abraham Silberschatz', 'Computer Science', 6, 6, '978-1118063330'),
('Computer Networks', 'Andrew S. Tanenbaum', 'Networking', 5, 4, '978-0132126953'),
('React: Up and Running', 'Stoyan Stefanov', 'Frontend Development', 6, 6, '978-1492085843');

-- Seed Borrow Records
INSERT INTO borrow (student_id, book_id, issue_date, due_date, status) VALUES
(3, 1, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'BORROWED'),
(3, 2, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 6 DAY), 'OVERDUE'),
(4, 4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 9 DAY), 'BORROWED'),
(5, 7, DATE_SUB(CURDATE(), INTERVAL 18 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'OVERDUE');

-- Seed Return Records (Returned books with fines if returned overdue)
-- Let's say Aarav previously borrowed book 9 and returned it 2 days late:
INSERT INTO borrow (student_id, book_id, issue_date, due_date, status) VALUES
(3, 9, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 16 DAY), 'RETURNED');

INSERT INTO returns (borrow_id, return_date, fine) VALUES
(5, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 10.00);
