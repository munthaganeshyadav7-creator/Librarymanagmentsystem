package com.library.dto;

import com.library.entity.Borrow;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStats {
    private long totalBooks;
    private long totalInventoryCopies;
    private long totalAvailableCopies;
    private long totalStudents;
    private long activeBorrows;
    private long overdueBorrows;
    private long totalReturns;
    private BigDecimal totalFines;
    private List<Borrow> recentBorrows;
    private Map<String, Long> categoryDistribution;

    public DashboardStats() {
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalInventoryCopies() {
        return totalInventoryCopies;
    }

    public void setTotalInventoryCopies(long totalInventoryCopies) {
        this.totalInventoryCopies = totalInventoryCopies;
    }

    public long getTotalAvailableCopies() {
        return totalAvailableCopies;
    }

    public void setTotalAvailableCopies(long totalAvailableCopies) {
        this.totalAvailableCopies = totalAvailableCopies;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getActiveBorrows() {
        return activeBorrows;
    }

    public void setActiveBorrows(long activeBorrows) {
        this.activeBorrows = activeBorrows;
    }

    public long getOverdueBorrows() {
        return overdueBorrows;
    }

    public void setOverdueBorrows(long overdueBorrows) {
        this.overdueBorrows = overdueBorrows;
    }

    public long getTotalReturns() {
        return totalReturns;
    }

    public void setTotalReturns(long totalReturns) {
        this.totalReturns = totalReturns;
    }

    public BigDecimal getTotalFines() {
        return totalFines;
    }

    public void setTotalFines(BigDecimal totalFines) {
        this.totalFines = totalFines;
    }

    public List<Borrow> getRecentBorrows() {
        return recentBorrows;
    }

    public void setRecentBorrows(List<Borrow> recentBorrows) {
        this.recentBorrows = recentBorrows;
    }

    public Map<String, Long> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(Map<String, Long> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }
}
