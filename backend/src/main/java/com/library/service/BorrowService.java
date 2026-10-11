package com.library.service;

import com.library.dto.BorrowRequest;
import com.library.dto.ReturnResponse;
import com.library.entity.Book;
import com.library.entity.Borrow;
import com.library.entity.ReturnRecord;
import com.library.entity.Student;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRepository;
import com.library.repository.ReturnRepository;
import com.library.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class BorrowService {

    public static final BigDecimal DAILY_FINE_RATE = new BigDecimal("5.00"); // 5.00 currency units per overdue day

    private final BorrowRepository borrowRepository;
    private final ReturnRepository returnRepository;
    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public BorrowService(BorrowRepository borrowRepository,
                         ReturnRepository returnRepository,
                         BookRepository bookRepository,
                         StudentRepository studentRepository) {
        this.borrowRepository = borrowRepository;
        this.returnRepository = returnRepository;
        this.bookRepository = bookRepository;
        this.studentRepository = studentRepository;
    }

    public Borrow borrowBook(BorrowRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + request.getStudentId()));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Book not found with ID: " + request.getBookId()));

        if (book.getAvailableQuantity() <= 0) {
            throw new IllegalStateException("Sorry, no copies of '" + book.getTitle() + "' are currently available.");
        }

        // Check if student already holds an unreturned copy of this book
        List<Borrow> activeForBook = borrowRepository.findActiveByStudentAndBook(student.getStudentId(), book.getBookId());
        if (!activeForBook.isEmpty()) {
            throw new IllegalStateException("You already have an active loan for this book: " + book.getTitle());
        }

        int loanDays = (request.getDays() != null && request.getDays() > 0) ? request.getDays() : 14;
        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = issueDate.plusDays(loanDays);

        Borrow borrow = new Borrow(student, book, issueDate, dueDate);
        borrow.setStatus("BORROWED");

        // Decrement available copies
        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        return borrowRepository.save(borrow);
    }

    public ReturnResponse returnBook(Long borrowId) {
        Borrow borrow = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new IllegalArgumentException("Borrow record not found with ID: " + borrowId));

        if ("RETURNED".equalsIgnoreCase(borrow.getStatus())) {
            throw new IllegalStateException("This book has already been marked as returned.");
        }

        LocalDate returnDate = LocalDate.now();
        LocalDate dueDate = borrow.getDueDate();

        BigDecimal fine = BigDecimal.ZERO;
        long daysOverdue = 0;

        if (returnDate.isAfter(dueDate)) {
            daysOverdue = ChronoUnit.DAYS.between(dueDate, returnDate);
            fine = DAILY_FINE_RATE.multiply(BigDecimal.valueOf(daysOverdue));
        }

        // Create return record
        ReturnRecord returnRecord = new ReturnRecord(borrow, returnDate, fine);
        ReturnRecord savedReturn = returnRepository.save(returnRecord);

        // Update borrow status
        borrow.setStatus("RETURNED");
        borrowRepository.save(borrow);

        // Increment available quantity of book
        Book book = borrow.getBook();
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);
        bookRepository.save(book);

        // Prepare return response
        ReturnResponse response = new ReturnResponse();
        response.setReturnId(savedReturn.getReturnId());
        response.setBorrowId(borrow.getBorrowId());
        response.setBookTitle(book.getTitle());
        response.setStudentName(borrow.getStudent().getName());
        response.setIssueDate(borrow.getIssueDate());
        response.setDueDate(borrow.getDueDate());
        response.setReturnDate(returnDate);
        response.setDaysOverdue(daysOverdue);
        response.setFine(fine);
        response.setMessage(daysOverdue > 0
                ? "Book returned successfully. Late by " + daysOverdue + " day(s). Fine accrued: ₹" + fine
                : "Book returned successfully on time! No fine.");

        return response;
    }

    public void refreshOverdueStatuses() {
        LocalDate today = LocalDate.now();
        List<Borrow> overdueList = borrowRepository.findOverdueBorrows(today);
        for (Borrow b : overdueList) {
            b.setStatus("OVERDUE");
            borrowRepository.save(b);
        }
    }

    @Transactional(readOnly = true)
    public List<Borrow> getStudentBorrowHistory(Long studentId) {
        refreshOverdueStatuses();
        return borrowRepository.findByStudentStudentIdOrderByBorrowIdDesc(studentId);
    }

    @Transactional(readOnly = true)
    public List<Borrow> getAllBorrows() {
        refreshOverdueStatuses();
        return borrowRepository.findAllByOrderByBorrowIdDesc();
    }

    @Transactional(readOnly = true)
    public List<Borrow> getActiveBorrows() {
        refreshOverdueStatuses();
        return borrowRepository.findByStatusOrderByBorrowIdDesc("BORROWED");
    }

    @Transactional(readOnly = true)
    public List<Borrow> getOverdueBorrows() {
        refreshOverdueStatuses();
        return borrowRepository.findByStatusOrderByBorrowIdDesc("OVERDUE");
    }
}
