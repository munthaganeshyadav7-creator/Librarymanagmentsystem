package com.library.service;

import com.library.dto.DashboardStats;
import com.library.entity.Book;
import com.library.entity.Borrow;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRepository;
import com.library.repository.ReturnRepository;
import com.library.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;
    private final BorrowRepository borrowRepository;
    private final ReturnRepository returnRepository;
    private final BorrowService borrowService;

    @Autowired
    public DashboardService(BookRepository bookRepository,
                            StudentRepository studentRepository,
                            BorrowRepository borrowRepository,
                            ReturnRepository returnRepository,
                            BorrowService borrowService) {
        this.bookRepository = bookRepository;
        this.studentRepository = studentRepository;
        this.borrowRepository = borrowRepository;
        this.returnRepository = returnRepository;
        this.borrowService = borrowService;
    }

    public DashboardStats getAdminDashboardStats() {
        borrowService.refreshOverdueStatuses();

        DashboardStats stats = new DashboardStats();
        stats.setTotalBooks(bookRepository.count());
        stats.setTotalInventoryCopies(bookRepository.sumTotalQuantity());
        stats.setTotalAvailableCopies(bookRepository.sumAvailableQuantity());
        stats.setTotalStudents(studentRepository.count());
        stats.setActiveBorrows(borrowRepository.countByStatus("BORROWED"));
        stats.setOverdueBorrows(borrowRepository.countByStatus("OVERDUE"));
        stats.setTotalReturns(returnRepository.count());
        stats.setTotalFines(returnRepository.sumTotalFines());

        // Recent 8 borrows
        List<Borrow> allBorrows = borrowRepository.findAllByOrderByBorrowIdDesc();
        stats.setRecentBorrows(allBorrows.stream().limit(8).toList());

        // Category distribution
        List<Book> books = bookRepository.findAll();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Book b : books) {
            String cat = (b.getCategory() != null && !b.getCategory().isBlank()) ? b.getCategory() : "General";
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0L) + 1L);
        }
        stats.setCategoryDistribution(categoryMap);

        return stats;
    }

    public Map<String, Object> getStudentDashboardStats(Long studentId) {
        borrowService.refreshOverdueStatuses();

        Map<String, Object> result = new HashMap<>();
        long activeCount = borrowRepository.countActiveByStudentId(studentId);
        long overdueCount = borrowRepository.countOverdueByStudentId(studentId);
        List<Borrow> history = borrowRepository.findByStudentStudentIdOrderByBorrowIdDesc(studentId);
        BigDecimal totalFines = returnRepository.sumTotalFinesByStudentId(studentId);

        result.put("activeLoans", activeCount);
        result.put("overdueLoans", overdueCount);
        result.put("totalBorrowed", history.size());
        result.put("totalFines", totalFines != null ? totalFines : BigDecimal.ZERO);
        result.put("recentBorrows", history.stream().limit(5).toList());

        return result;
    }
}
