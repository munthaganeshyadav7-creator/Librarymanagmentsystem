package com.library.dto;

import jakarta.validation.constraints.NotNull;

public class BorrowRequest {

    @NotNull(message = "studentId is required")
    private Long studentId;

    @NotNull(message = "bookId is required")
    private Long bookId;

    private Integer days = 14; // Default loan period: 14 days

    public BorrowRequest() {
    }

    public BorrowRequest(Long studentId, Long bookId, Integer days) {
        this.studentId = studentId;
        this.bookId = bookId;
        this.days = (days != null && days > 0) ? days : 14;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }
}
