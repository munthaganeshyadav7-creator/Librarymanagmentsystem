package com.library.repository;

import com.library.entity.ReturnRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRepository extends JpaRepository<ReturnRecord, Long> {

    Optional<ReturnRecord> findByBorrowBorrowId(Long borrowId);

    @Query("SELECT COALESCE(SUM(r.fine), 0) FROM ReturnRecord r")
    BigDecimal sumTotalFines();

    @Query("SELECT COALESCE(SUM(r.fine), 0) FROM ReturnRecord r WHERE r.borrow.student.studentId = :studentId")
    BigDecimal sumTotalFinesByStudentId(@Param("studentId") Long studentId);

    List<ReturnRecord> findAllByOrderByReturnIdDesc();
}
