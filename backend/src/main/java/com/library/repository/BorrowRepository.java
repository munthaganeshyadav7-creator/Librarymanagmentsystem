package com.library.repository;

import com.library.entity.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    List<Borrow> findByStudentStudentIdOrderByBorrowIdDesc(Long studentId);

    List<Borrow> findByStatusOrderByBorrowIdDesc(String status);

    List<Borrow> findAllByOrderByBorrowIdDesc();

    long countByStatus(String status);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.student.studentId = :studentId AND b.status = 'BORROWED'")
    long countActiveByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.student.studentId = :studentId AND b.status = 'OVERDUE'")
    long countOverdueByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT b FROM Borrow b WHERE b.status = 'BORROWED' AND b.dueDate < :today")
    List<Borrow> findOverdueBorrows(@Param("today") LocalDate today);

    @Query("SELECT b FROM Borrow b WHERE b.student.studentId = :studentId AND b.book.bookId = :bookId AND b.status IN ('BORROWED', 'OVERDUE')")
    List<Borrow> findActiveByStudentAndBook(@Param("studentId") Long studentId, @Param("bookId") Long bookId);
}
