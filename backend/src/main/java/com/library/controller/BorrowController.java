package com.library.controller;

import com.library.dto.ApiResponse;
import com.library.dto.BorrowRequest;
import com.library.dto.ReturnResponse;
import com.library.entity.Borrow;
import com.library.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BorrowController {

    private final BorrowService borrowService;

    @Autowired
    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping("/borrow")
    public ResponseEntity<ApiResponse<Borrow>> borrowBook(@Valid @RequestBody BorrowRequest request) {
        try {
            Borrow borrow = borrowService.borrowBook(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Book issued successfully! Due date: " + borrow.getDueDate(), borrow));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to borrow book: " + e.getMessage()));
        }
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<ApiResponse<ReturnResponse>> returnBookPut(@PathVariable("id") Long borrowId) {
        return processReturn(borrowId);
    }

    @PostMapping("/return/{id}")
    public ResponseEntity<ApiResponse<ReturnResponse>> returnBookPost(@PathVariable("id") Long borrowId) {
        return processReturn(borrowId);
    }

    private ResponseEntity<ApiResponse<ReturnResponse>> processReturn(Long borrowId) {
        try {
            ReturnResponse response = borrowService.returnBook(borrowId);
            return ResponseEntity.ok(ApiResponse.ok("Book returned successfully", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process return: " + e.getMessage()));
        }
    }

    @GetMapping("/borrow/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Borrow>>> getStudentBorrows(@PathVariable Long studentId) {
        List<Borrow> history = borrowService.getStudentBorrowHistory(studentId);
        return ResponseEntity.ok(ApiResponse.ok("Student borrow history retrieved", history));
    }

    @GetMapping("/borrow/all")
    public ResponseEntity<ApiResponse<List<Borrow>>> getAllBorrows() {
        List<Borrow> list = borrowService.getAllBorrows();
        return ResponseEntity.ok(ApiResponse.ok("All loans retrieved", list));
    }

    @GetMapping("/borrow/active")
    public ResponseEntity<ApiResponse<List<Borrow>>> getActiveBorrows() {
        List<Borrow> list = borrowService.getActiveBorrows();
        return ResponseEntity.ok(ApiResponse.ok("Active loans retrieved", list));
    }

    @GetMapping("/borrow/overdue")
    public ResponseEntity<ApiResponse<List<Borrow>>> getOverdueBorrows() {
        List<Borrow> list = borrowService.getOverdueBorrows();
        return ResponseEntity.ok(ApiResponse.ok("Overdue loans retrieved", list));
    }
}
