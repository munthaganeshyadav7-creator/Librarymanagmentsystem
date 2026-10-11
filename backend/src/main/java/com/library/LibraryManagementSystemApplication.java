package com.library;

import com.library.entity.Book;
import com.library.entity.Borrow;
import com.library.entity.ReturnRecord;
import com.library.entity.Student;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRepository;
import com.library.repository.ReturnRepository;
import com.library.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;

@SpringBootApplication
public class LibraryManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryManagementSystemApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(StudentRepository studentRepository,
                                         BookRepository bookRepository,
                                         BorrowRepository borrowRepository,
                                         ReturnRepository returnRepository) {
        return args -> {
            if (studentRepository.count() == 0) {
                System.out.println(">>> Initializing default users...");
                Student admin = new Student("System Administrator", "admin@library.college.edu", "admin123", "9876543210", "ADMIN");
                Student librarian = new Student("Head Librarian", "librarian@library.college.edu", "lib123", "9876543211", "LIBRARIAN");
                Student aarav = new Student("Aarav Sharma", "aarav.sharma@college.edu", "student123", "9123456780", "STUDENT");
                Student priya = new Student("Priya Patel", "priya.patel@college.edu", "student123", "9123456781", "STUDENT");
                Student rohan = new Student("Rohan Verma", "rohan.verma@college.edu", "student123", "9123456782", "STUDENT");
                Student ananya = new Student("Ananya Iyer", "ananya.iyer@college.edu", "student123", "9123456783", "STUDENT");

                studentRepository.save(admin);
                studentRepository.save(librarian);
                studentRepository.save(aarav);
                studentRepository.save(priya);
                studentRepository.save(rohan);
                studentRepository.save(ananya);
            }

            if (bookRepository.count() == 0) {
                System.out.println(">>> Initializing default books catalog...");
                bookRepository.save(new Book("Clean Code: A Handbook of Agile Software Craftsmanship", "Robert C. Martin", "Computer Science", 8, "978-0132350884"));
                bookRepository.save(new Book("Introduction to Algorithms (CLRS)", "Thomas H. Cormen", "Algorithms", 5, "978-0262033848"));
                bookRepository.save(new Book("Spring Boot in Action", "Craig Walls", "Web Development", 6, "978-1617292545"));
                bookRepository.save(new Book("Design Patterns: Elements of Reusable Object-Oriented Software", "Erich Gamma et al.", "Software Engineering", 4, "978-0201633610"));
                bookRepository.save(new Book("Artificial Intelligence: A Modern Approach", "Stuart Russell & Peter Norvig", "Artificial Intelligence", 5, "978-0136042594"));
                bookRepository.save(new Book("Database System Concepts", "Abraham Silberschatz", "Databases", 7, "978-0073523323"));
                bookRepository.save(new Book("Head First Java", "Kathy Sierra & Bert Bates", "Programming", 10, "978-0596009205"));
                bookRepository.save(new Book("Operating System Concepts", "Abraham Silberschatz", "Computer Science", 6, "978-1118063330"));
                bookRepository.save(new Book("Computer Networks", "Andrew S. Tanenbaum", "Networking", 5, "978-0132126953"));
                bookRepository.save(new Book("React: Up and Running", "Stoyan Stefanov", "Frontend Development", 6, "978-1492085843"));
                bookRepository.save(new Book("Designing Data-Intensive Applications", "Martin Kleppmann", "System Design", 5, "978-1449373320"));
                bookRepository.save(new Book("Python Crash Course", "Eric Matthes", "Programming", 8, "978-1593279288"));
            }

            if (borrowRepository.count() == 0) {
                System.out.println(">>> Initializing sample borrow & return transactions...");
                studentRepository.findByEmail("aarav.sharma@college.edu").ifPresent(student -> {
                    bookRepository.findAll().stream().findFirst().ifPresent(book -> {
                        // 1 Active loan
                        Borrow b1 = new Borrow(student, book, LocalDate.now().minusDays(5), LocalDate.now().plusDays(9));
                        b1.setStatus("BORROWED");
                        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
                        bookRepository.save(book);
                        borrowRepository.save(b1);
                    });

                    // 1 Overdue loan
                    if (bookRepository.findAll().size() > 1) {
                        Book book2 = bookRepository.findAll().get(1);
                        Borrow b2 = new Borrow(student, book2, LocalDate.now().minusDays(20), LocalDate.now().minusDays(6));
                        b2.setStatus("OVERDUE");
                        book2.setAvailableQuantity(book2.getAvailableQuantity() - 1);
                        bookRepository.save(book2);
                        borrowRepository.save(b2);
                    }

                    // 1 Returned loan with past fine
                    if (bookRepository.findAll().size() > 2) {
                        Book book3 = bookRepository.findAll().get(2);
                        Borrow b3 = new Borrow(student, book3, LocalDate.now().minusDays(25), LocalDate.now().minusDays(11));
                        b3.setStatus("RETURNED");
                        borrowRepository.save(b3);

                        ReturnRecord ret = new ReturnRecord(b3, LocalDate.now().minusDays(9), new BigDecimal("10.00"));
                        returnRepository.save(ret);
                    }
                });
            }
        };
    }
}
